import {
  observable
  , action
  , ObservableMap
  , extendObservable
  , computed,
  autorun,
  when
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
  ITrack,
  IMiniUser
} from '../interfaces/interface';
import {
  addAccessToken, apiUrl,
  unauthApiUrlV2, unauthApiUrl
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
  // 
  debouncedRequestFollowUser: any;
  @observable fetchedPlaylist: IPlaylist | undefined
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

  @action setFetchedPlaylistInfo = (data: IPlaylist | undefined) => {
    this.fetchedPlaylist = data
  }

  async fetchPlaylistData(id: number) {
    try {
      const data = await fetch(unauthApiUrl(`playlists/${id}`, '?'))

      this.setFetchedPlaylistInfo(<IPlaylist>data)

    } catch (err) {
      // console.error(err)
    }
  }

  @action findPlaylistFromCurrentUser = (id: number) => {
    const um = this.userModel
    let p: undefined | IPlaylist = undefined
    if (um) {
      p = um.playlists.find((item) => item.id === id)
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


  async detectIsFollowing(id: number) {
    //  https://api-v2.soundcloud.com/users/7586270/followers/followed_by/278227204?client_id=2t9loNQH90kzJcsFCODdigxfp325aq4z&limit=10&offset=0&linked_partitioning=1&app_version=1491855525
    const data = await fetch(unauthApiUrlV2(`users/${id}/followings/not_followed_by/${this.loginedUserId}`, "?"))
    console.log(data);
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
    console.log(data)
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

export class User implements IMiniUser {
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
  kind: string
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



  private isLoadings = {
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
    if (typeof obj === 'number') {
      this.user = new User(obj)
      this.fetchUser()
    } else {
      this.setUser(obj)
    }
    when(() => userStore.isLogined, () => this.followingFilterByLogin(userStore.isLogined), this)
  }
  getAllTrackFromStreams(): ITrack[] {
    return this.streams.filter(stream => stream.track != null).map(s => s.track);
  }



  @action fetchCommunityData() {

    this.fetchWithType(FETCH_FOLLOWERS);
    this.fetchWithType(FETCH_FOLLOWINGS);
    this.fetchWithType(FETCH_FAVORITES);

  }

  @action async fetchUser() {
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


  @action addData(type: string, fs: any[]) {
    const targetArr = this[type]
    if (!targetArr) {
      extendObservable(this[type], []);
    }

    let user: any = {}
    // 除了是登录用户外,
    switch (type) {
      case FETCH_FOLLOWERS:
      case FETCH_FOLLOWINGS:
        fs.forEach(data => {
          user = new User(data)
          targetArr.push(user)
          if (this.userStore.isLogined) {
            // user.isFollowing = this.userStore.isFollowingUser(user.id)
          }
        })
        break
      // case FETCH_PLAYLIST:
      //   const pls = <IPlaylist[]>fs
      //   pls.forEach(pl => {
      //     if (this.userStore.isLogined) {
      //       // observable(pl.user)
      //     }
      //   })
      //   break
      default:
        fs.forEach(data => targetArr.push(data))

    }
  }

  @action async followingFilterByLogin(isLogined: boolean) {

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
      this.resetErr(fetchType)
      this.changeLoadingState(fetchType, true);
      let data: any = await fetch(url);
      if (Array.isArray(data)) {
        this.addData(fetchType, data);
      } else {
        this.addData(fetchType, data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
      }
    } catch (err) {
      this.catchErr({ err, fetchType }, fetchType)
    } finally {
      this.changeLoadingState(fetchType, false)
    }
  }

  isError = (genre: string): boolean => {
    return performanceStore.isError(genre)
  }

  protected catchErr = (err: any, genre: string) => {
    performanceStore.catchErr(err, genre);
  }
  protected resetErr = (genre: string) => {
    performanceStore.resetErrorsMap(genre)
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
        case FETCH_PLAYLIST:
          url = `users/${id}/${fetchType}`
          url = unauthApiUrl(url + `?limit=${limitPageSize}&offset=0&linked_partitioning=1`, '&')
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
