import {
  observable
  , action
  , ObservableMap
  , extendObservable
  , computed,
  autorun,
  whyRun
} from 'mobx';
import {
  FETCH_FOLLOWERS
  , FETCH_FAVORITES
  , FETCH_FOLLOWINGS
  , FETCH_STREAM
  , FETCH_USER
  , FETCH_PLAYLIST
} from '../constants/fetchTypes'
import {
  IPlaylist,
  IStream,
  ITrack
} from '../interfaces/interface';
import {
  addAccessToken, apiUrl,
  unauthApiUrlV2
} from '../services/soundcloundApi';

import { performanceStore } from './index'
import { RaceFetch as fetch } from '../services/Fetch'
const debounce = require('lodash/debounce')

interface ICatchErr {
  err: {
    type: string,
    msg: string
  }
  fetchType?: string;
}
const limitPageSize = 20;

export class UserStore {
  debouncedRequestFollowUser: any;
  @observable fetchedPlaylist: IPlaylist | null
  @observable userModel: UserModel | undefined

  private userModels = new ObservableMap<UserModel>()
  // 当前的登录用户
  @observable private loginedUserId: number | undefined

  constructor() {
    this.debouncedRequestFollowUser = debounce(this.followUser, 500)
  }

  initUser(obj: number | User): UserModel {
    const isNumber = typeof obj === 'number'
    let id = isNumber ? obj : ((<User>obj).id)
    let userModel = this.userModels.get(id + '')

    if (!userModel) {
      userModel = new UserModel(this, obj)
      userModel.fetchCommunityData()
      this.userModels.set(id + '', userModel)
    } else if (!isNumber) {
      userModel.setUser(<User>obj)
    }

    return userModel;
  }

  @action setCurrentUserModel(model: UserModel) {
    this.userModel = model
  }

  @computed get isLoginUser() {

    if (this.loginedUserId == null) { return false }
    const lum = this.userModel;

    return this.loginedUserId === (lum && lum.user && lum.user.userId)
  }

  @computed get isLogined() {
    return this.loginedUserId != null
  }

  @action setLoginUserModel(userId: number | undefined) {

    if (userId === undefined) {
      this.userModels.delete(this.loginedUserId + '')
      this.userModel = undefined
    }


    this.loginedUserId = userId
    if (userId !== undefined) {
      const um = this.getLoginUserModel

      if (um && um.playlists.length < 1) {
        um.fetchWithType(FETCH_PLAYLIST);
      }
    }
  }

  @computed get getLoginUserModel(): UserModel | undefined {
    return this.userModels.get(this.loginedUserId + '')
  }

  fetchUserData(id: number) {
    const userModel = this.userModels.get(id + '')
    if (userModel) {
      userModel.fetchUser()
      this.setCurrentUserModel(userModel)
    }
    return this;
  }

  @action setFetchedPlaylistInfo = (data: IPlaylist | null) => {
    this.fetchedPlaylist = data
  }

  async fetchPlaylistData(id: number) {
    try {
      const data = await fetch(apiUrl(`playlists/${id}`, '?'))
      this.setFetchedPlaylistInfo(<IPlaylist>data)
    } catch (err) {
      // console.error(err)
    }
  }

  @action findPlaylistFromCurrentUser = (id: number) => {
    const um = this.userModel
    let p = undefined
    if (um) {
      p = <IPlaylist>um.playlists.find((item) => item.id === id)
    }

    if (p == null) {
      this.fetchPlaylistData(id)
    } else {
      this.setFetchedPlaylistInfo(p)

    }
  }

  isFollowingUser(id: number): boolean {
    const lm = this.getLoginUserModel
    if (!lm) { return false }
    return lm.followings.find(u => u.id === id) != null
  }
  AllUsersFavorities(): ITrack[] {
    const tracks: ITrack[] = []
    this.userModels.values().forEach((model) => {
      tracks.push(...model.favorites)
    })
    return tracks;
  }
  /**
   * follow用户
   * todo fix 404
   */
  private async  followUser(user: User) {
    // todo 添加modal?
    if (!this.getLoginUserModel) {
      return
    }
    const { id, isFollowing } = user
    // const isFollowing = await this.isFollowingUser(id)
    const data: any = await fetch(
      apiUrl(`me/followings/${id}`, '?'),
      {
        method: isFollowing ? 'delete' : 'put'
      }
    )

    if (data) {
      this.operaUserFromFollowings(user, isFollowing)
    }
  }




  @action private operaUserFromFollowings(user: User, followed: boolean) {
    const lum = this.getLoginUserModel
    if (!lum) return
    if (followed) {
      user.isFollowing = false
      lum.followings.splice(lum.followings.indexOf(user), 1)
    } else {
      user.isFollowing = true
      lum.followings.unshift(user)
    }
  }

}

export class User {
  userId: number
  description: string
  @observable isFollowing: boolean = false
  @observable id: number;
  permalink: string
  username: string
  uri: string
  permalink_url: string
  @observable avatar_url: string
  country: string
  @observable full_name: string
  city: string
  // description: string
  discogs_name: string
  comments_count: number
  myspace_name: string
  website: string
  website_title: string
  online: boolean
  @observable track_count: number
  playlist_count: number
  @observable followers_count: number
  @observable followings_count: number
  @observable public_favorites_count: number
  plan: string
  private_tracks_count: number
  private_playlists_count: number
  primary_email_confirmed: number
  constructor(obj: User | number) {
    if (typeof obj === 'number') {
      this.userId = obj
      return this;
    } else {
      this.userId = obj.id
      this.updateFromServe(obj);
    }

  }

  @action updateFromServe = (rawUser: User) => {
    extendObservable(this, rawUser);
  }

  @action setFollowingState(following: boolean) {
    this.isFollowing = following
  }
}
export class UserModel {
  @observable user: User;
  // TODO change to ObservableMap  
  @observable followers: User[] = [];
  @observable followings: User[] = [];
  @observable streams: IStream[] = []
  @observable favorites: ITrack[] = [];
  @observable playlists: IPlaylist[] = [];

  isErrorsMap = new ObservableMap<boolean>()



  isLoadings = {
    get: performanceStore.getLoadingStateWidthKey,
    set: performanceStore.setLoadingStateWithKey
  };

  nextHrefs = new ObservableMap<string>();
  userStore: UserStore;

  /**
   * @param obj 如果传入的是一个Iuser对象,直接去获取数据
   */
  constructor(userStore: UserStore, obj: number | User) {
    this.userStore = userStore
    if (typeof obj == 'number') {
      this.user = new User(obj)
      // this.user = observable.struct(user);
      this.fetchUser()
    } else {
      this.setUser(obj)
    }
    autorun(() => this.followingFilterByLogin(userStore.isLogined), this)
    // whyRun(() => this.followingFilterByLogin())
  }
  getAllTrackFromStreams(): ITrack[] {
    return this.streams.filter(stream => stream.track != null).map(s => s.track);
  }



  @action fetchCommunityData() {

    this.fetchWithType(FETCH_FOLLOWERS);
    this.fetchWithType(FETCH_FOLLOWINGS);
    this.fetchWithType(FETCH_FAVORITES);

  }

  async fetchUser() {
    const url = apiUrl(`users/${this.user.userId}`, '?')
    try {
      this.changeLoadingState(FETCH_USER, true)
      const rawUser: any = await fetch(url)
      this.user.updateFromServe(rawUser)
    } catch (err) {
      this.catchErr(err, FETCH_USER);
    } finally {
      this.changeLoadingState(FETCH_USER, false)
    }
  }

  @action setUser(rawUser: User) {
    this.user = new User(rawUser)
  }

  isLoading(type: string): boolean {
    const isIng = this.isLoadings.get(type)
    return isIng == null ? false : isIng
  }
  @action changeLoadingState(type: string, loading: boolean) {
    this.isLoadings.set(type, loading)
  }
  @action changeNextHrefs(type: string, nextHref: string) {
    this.nextHrefs.set(type, nextHref)
  }

  @action resetLoadingState(type: string) {
    this.isLoadings.set(type, false);
  }


  @action addData(type: string, fs: User[]) {
    const targetArr = this[type]
    if (!targetArr) {
      extendObservable(this[type], []);
    }

    let user: any = {}
    // 除了是登录用户外,
    if (type === FETCH_FOLLOWERS || type === FETCH_FOLLOWINGS) {
      fs.forEach(data => {
        user = new User(data)
        targetArr.push(user)
        if (this.userStore.isLogined) {
          user.isFollowing = this.userStore.isFollowingUser(user.id)
        }
      })
    } else {
      fs.forEach(data => targetArr.push(data))
    }
  }

  @action followingFilterByLogin(isLogined: boolean) {

    if (isLogined) {
      this.followers.forEach(user =>
        user.isFollowing = this.userStore.isFollowingUser(user.id)
      )
      this.followings.forEach(user =>
        user.isFollowing = this.userStore.isFollowingUser(user.id)
      )
    }
  }

  apiStream(id: number) {
    return unauthApiUrlV2(`stream/users/${id}`, `limit=15&offset=0&linked_partitioning=1`)
  }

  @action async fetchWithType(type: string) {
    if (this.isLoadings.get(type) === true) {
      return
    }
    let id = this.user.userId;
    if (id == null) {
      return
    }
    const fetchType = type
    let url = this.getFetchUrl(fetchType, id)
    if (!url) { return }

    try {
      this.changeLoadingState(fetchType, true);
      let data: any = await fetch(url);

      if (Array.isArray(data)) {
        this.addData(fetchType, data);
      } else {
        this.addData(fetchType, data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
      }
    } catch (err) {
      console.error(err)
      this.catchErr({ err, fetchType }, fetchType)
    } finally {
      this.changeLoadingState(fetchType, false)
    }
  }
  isError = (genre: string): boolean => {
    return this.isErrorsMap.get(genre) || false
  }

  @action protected catchErr = (err: any, genre: string) => {
    this.isErrorsMap.set(genre, true);
  }

  private getFetchUrl(fetchType: string, id: number) {
    let url = this.nextHrefs.get(fetchType)
    if (url) {
      url = addAccessToken(url, '&')
    } else if (!url && this[fetchType].length < 1) {
      // debugger
      switch (fetchType) {
        case FETCH_STREAM:
          url = this.apiStream(id);
          break
        default:
          url = `users/${id}/${fetchType}`
          url = apiUrl(url + `?limit=${limitPageSize}&offset=0&linked_partitioning=1`, '&')
      }
    }
    return url
  }


}


export default new UserStore();
