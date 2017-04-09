import {
  observable
  , action
  , ObservableMap
  , extendObservable
  , computed
  ,
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
  IStream
} from '../interfaces/interface';
import {
  addAccessToken, apiUrl,
  unauthApiUrlV2
} from '../services/soundcloundApi';
import { ITrack } from './index';
import PerformanceStore from './PerformanceStore'
import {
  logError
} from '../services/logger'
import { RaceFetch as fetch } from '../services/Fetch'


import * as _ from 'lodash'


interface ICatchErr {
  err: {
    type: string,
    msg: string
  }
  fetchType?: string;
}
const limitPageSize = 20;


export class UserStore {
  @observable fetchedPlaylist: IPlaylist | null
  @observable userModel: IUserModel

  private userModels = new ObservableMap<UserModel>()
  // 当前的登录用户
  private loginModel: IUserModel
  @observable private loginedUserId: number | undefined

  initUser(obj: number | User): IUserModel {
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

  @action setCurrentUserModel(model: IUserModel) {
    this.userModel = model
  }

  @computed get isLoginUser() {

    if (this.loginedUserId == null) { return false }
    const lum = this.userModel;

    return this.loginedUserId === (lum.user && lum.user.userId)
  }

  @computed get isLogined() {
    return this.loginedUserId != null
  }

  @action setLoginUserModel(userId: number | undefined) {

    if (userId === undefined) {
      this.userModels.delete(this.loginedUserId + '')
      let um: any = this.userModel
      um = null;
    }


    this.loginedUserId = userId
    if (userId !== undefined) {
      const um = this.getLoginUserModel()
      if (um.playlists.length < 1) {
        um.fetchWithType(FETCH_PLAYLIST);
      }
    }
  }
  getLoginUserModel(): IUserModel {
    if (!this.loginModel) {
      this.loginModel = <IUserModel>this.userModels.get(this.loginedUserId + '')
    }
    return this.loginModel
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
      p = <IPlaylist>this.userModel.playlists.find((item) => item.id === id)
    }

    if (p == null) {
      this.fetchPlaylistData(id)
    } else {
      this.setFetchedPlaylistInfo(p)

    }
  }

  /**
   * follow用户
   * todo fix 404
   */
  async followUser(user: User) {
    // todo 添加modal?
    if (!this.getLoginUserModel()) {
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

  isFollowingUser(id: number): boolean {
    const lm = this.getLoginUserModel()
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

  @action operaUserFromFollowings(user: User, followed: boolean) {
    const lum = this.getLoginUserModel()
    if (followed) {
      user.isFollowing = false
      lum.followings.splice(lum.followings.indexOf(user), 1)
    } else {
      user.isFollowing = true
      lum.followings.unshift(user)
    }
  }
}

// const OPERATION_OK = 'Status(200) - OK'
// 目前不做歌单项目, 只能从用户那里过来
// class PlaylistStore {

//   优化内存的使用
//   combineUserPlaylist() {

//   }

export interface IUserModel {
  user: User;
  followers: User[];
  followings: User[];
  favorites: ITrack[];
  streams: IStream[]
  getAllTrackFromStreams: () => ITrack[]
  playlists: IPlaylist[];
  nextHrefs: {}
  fetchWithType: (type: string) => void
  fetchCommunityData: () => void
  isLoading: (type: string) => boolean
  isError: (type: string) => boolean
}


// }
/**
 * 以 用户id为key,保存数据
 */


export class User {
  userId: number
  description: string
  objMap = new ObservableMap<any>()
  isFollowing: boolean = false
  @observable id: number;
  permalink: string
  username: string
  uri: string
  permalink_url: string
  avatar_url: string
  country: string
  full_name: string
  city: string
  // description: string
  discogs_name: string
  comments_count: number
  myspace_name: string
  website: string
  website_title: string
  online: boolean
  track_count: number
  playlist_count: number
  followers_count: number
  followings_count: number
  public_favorites_count: number
  plan: string
  private_tracks_count: number
  private_playlists_count: number
  primary_email_confirmed: number
  // custom perpoty 
  // isFollowing: boolean
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
class UserModel implements IUserModel {
  @observable user: User;
  // TODO change to ObservableMap  
  @observable followers: User[] = [];
  @observable followings: User[] = [];
  @observable streams: IStream[] = []
  @observable favorites: ITrack[] = [];
  @observable playlists: IPlaylist[] = [];
  isErrorsMap = new ObservableMap<boolean>()



  isLoadings = {
    get: PerformanceStore.getLoadingStateWidthKey,
    set: PerformanceStore.setLoadingStateWithKey
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
      observable.struct(this.user);
      this.fetchUser()
    } else {
      this.setUser(obj)
    }
  }
  getAllTrackFromStreams(): ITrack[] {
    return this.streams.filter(stream => stream.track != null).map(s => s.track);
  }



  @action fetchCommunityData() {


    this.fetchWithType(FETCH_FOLLOWERS);
    this.fetchWithType(FETCH_FOLLOWINGS);
    this.fetchWithType(FETCH_FAVORITES);
    // this.fetchWithType(FETCH_STREAM);
  }

  async fetchUser() {
    const url = apiUrl(`users/${this.user.userId}`, '?')
    try {
      this.changeLoadingState(FETCH_USER, true)
      const rawUser: any =
        await fetch(url)
      // .then(data => data.json()); 
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
          // console.log('------------')
          user.isFollowing = this.userStore.isFollowingUser(user.id);
        }
      })
    } else {
      fs.forEach(data => targetArr.push(data))
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
