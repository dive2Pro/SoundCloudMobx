import {
  observable, action
  , ObservableMap
  , extendObservable, computed,
  runInAction
} from "mobx";
import {
  FETCH_FOLLOWERS, FETCH_FAVORITES, FETCH_FOLLOWINGS, FETCH_ACTIVITIES,
  FETCH_STREAM
} from '../constants/fetchTypes'
import {
  IUser
  , IActivitiesItem,
  IPlaylist,
  IStream
} from "../interfaces/interface";
import {
  addAccessToken, apiUrl
  // , apiUrlV2
  // , unauthApiUrl,
  , unauthApiUrlV2
  // , unauthApiUrl
} from "../services/soundcloundApi";
import { ITrack } from "./index";
import { BaseAct } from "./TrackStore";
import PerformanceStore from './PerformanceStore'
import {
  logError
  // , logInfo
} from '../services/logger'
import { extendsObservableObjFromJson } from '../services/utils'

interface ICatchErr {
  err: any
  fetchType?: string;
}
const limitPageSize = 20;

export interface IActivitiesStore {
  fetchNextActivities: (first?: boolean) => void;
  filteredActivities: IActivitiesItem[];
  isLoading: boolean;
  setFilterType: (type: string) => void;
  setSortType: (type: string) => void;
  setFilterTitle: (type: string) => void;
  filterType: string
  sortType: string,
  filteredTracks: ITrack[];
}


class ActivitiesModel extends BaseAct<IActivitiesItem> implements IActivitiesStore {
  @observable filteredActivities: IActivitiesItem[];
  constructor() {
    super(FETCH_ACTIVITIES)
  }
  @computed get isLoading(): boolean {
    return this.isLoadingByGenre.get(FETCH_ACTIVITIES) || false
  }


  @action setNextActivitiesHref(nextHref: string) {
    this.setNextHrefByGenre(FETCH_ACTIVITIES, nextHref)
  }


  @action addActivities(arr: IActivitiesItem[]) {
    const items = this.currentItems;
    items.splice(items.length, 0, ...arr);

  }

  transToTracks(items: IActivitiesItem[]): ITrack[] {
    return items.map(this.getAllTrackFromActivity).filter(item => item != null);
  }

  getAllTrackFromActivity(act: IActivitiesItem) {
    return act.origin
  }

  @computed get tracks() {
    return this.currentItems && this.currentItems.map(this.getAllTrackFromActivity)
  }

  filterByFilterType(fs: IActivitiesItem[]) {
    let temp = fs.slice();
    if (!!this.filterType) {
      temp = fs.filter(item => {
        return item.type === this.filterType
      })
    }
    return temp;
  }
  filterActivities(arr: IActivitiesItem[]) {
    Promise.resolve(arr)
      .then(data => {
        const filterArr = data.filter(item => {
          const b =
            this.currentItems.some(active =>
              active.created_at === item.created_at)
          return !b;
        })
        this.addActivities(filterArr);
      })
  }

  @action setLoadingActivities(b: boolean) {
    this.setLoadingByGenre(FETCH_ACTIVITIES, b);
  }

  @action fetchNextActivities(first?: boolean) {
    PerformanceStore.setCurrentGenre(this.currentGenre)
    if (first && this.currentItems.length > 0) {
      return
    }
    if (!this.isLoading)
      this.fetchActivities(this.nextHref);
  }
  @action async fetchActivities(nextHref?: string) {
    let activitiesUrl = nextHref ? addAccessToken(nextHref, '&') :
      apiUrl(`me/activities?limit=50`, '&')
    try {
      this.setLoadingActivities(true);
      const data: any = await fetch(activitiesUrl)
        .then(response => response.json());
      // console.log(data)
      runInAction(() => {
        this.setNextActivitiesHref(data.next_href)
        this.filterActivities(data.collection);
        this.setLoadingActivities(false)

      })
    } finally {
      this.setLoadingActivities(false)
    }
  }
}

export interface IUserStore {
  initUser: (id: number | IUser) => IUserModel
  findPlaylistFromCurrentUser: (id: number) => IPlaylist
  setCurrentUserModel: (user: IUserModel) => void
  followUser: (user: IUser) => void
  fetchUserData: (id: number) => void;
  userModel: IUserModel
  isLoginUser: boolean
}


export class UserStore implements IUserStore {

  userModels = new ObservableMap<UserModel>()
  // 当前的登录用户
  loginModel: IUserModel
  @observable userModel: IUserModel
  loginedUserId: number
  constructor() { }

  initUser(obj: number | IUser): IUserModel {
    const isNumber = typeof obj === 'number'
    let id = isNumber ? obj : ((<IUser>obj).id)
    let userModel = this.userModels.get(id + "")
    if (!userModel) {
      userModel = new UserModel(this, obj)
      this.userModels.set(id + "", userModel)
    } else if (!isNumber) {
      userModel.setUser(<IUser>obj)
    }
    return userModel;
  }
  @action setCurrentUserModel(model: IUserModel) {
    this.userModel = model
  }

  @computed get isLoginUser() {
    if (!this.loginedUserId) { return false }
    const lum = this.getLoginUserModel();
    return this.loginedUserId === (lum.user && lum.user.userId)
  }

  setLoginUserModel(userId: number) {
    this.loginedUserId = userId
  }
  getLoginUserModel() {
    if (!this.loginModel)
      this.loginModel = <IUserModel>this.userModels.get(this.loginedUserId + "")
    return this.loginModel
  }

  fetchUserData(id: number) {
    const userModel = this.userModels.get(id + "")
    if (userModel) {
      userModel.fetchUser()
      this.setCurrentUserModel(userModel)
    }
    return this;
  }

  findPlaylistFromCurrentUser(id: number): IPlaylist {
    return <IPlaylist>this.getLoginUserModel().playlists.find((item) => item.id == id)
  }
  /**
   * follow用户
   * todo fix 404
   */
  async followUser(user: IUser) {
    const { id, isFollowing } = user
    // const isFollowing = await this.isFollowingUser(id)
    const raw = await fetch(apiUrl(`me/followings/${id}`, '?'), {
      method: isFollowing ? 'delete' : 'put'
    })
    const data = await raw.json()
    if (data) {
      this.operaUserFromFollowings(user, isFollowing)
    }
  }

  // isFollowingUser(id: number): boolean {
  //   const lm = this.getLoginUserModel()
  //   if (!lm) return false
  //   return lm.followings.find(u => u.id == id) != undefined
  // }

  AllUsersFavorities(): ITrack[] {
    const tracks: ITrack[] = []
    this.userModels.values().forEach((model) => {
      tracks.push(...model.favorites)
    })
    return tracks;
  }

  @action operaUserFromFollowings(user: IUser, followed: boolean) {
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
//目前不做歌单项目, 只能从用户那里过来
// class PlaylistStore {

//   优化内存的使用
//   combineUserPlaylist() {

//   }

export interface IUserModel {
  user: User;
  loadDataFromCookie: () => void;
  followers: IUser[];
  followings: IUser[];
  favorites: ITrack[];
  streams: IStream[]
  getAllTrackFromStreams: () => ITrack[]
  playlists: IPlaylist[];
  nextHrefs: {}
  fetchWithType: (type: string) => void
  fetchCommunityData: () => void
  isLoading: (type: string) => boolean
}


// }
/**
 * 以 用户id为key,保存数据
 */


export class User {
  userId: number

  @observable isFollowing: boolean = false

  constructor(obj: IUser | number) {
    if (typeof obj === 'number') {
      this.userId = obj
    } else {
      this.userId = obj.id
      this.updateFromServe(obj);
    }
  }

  @action updateFromServe(rawUser: IUser) {
    extendsObservableObjFromJson(this, rawUser);
  }

  @action setFollowingState(following: boolean) {
    this.isFollowing = following
  }
}
class UserModel implements IUserModel {
  @observable user: User;
  // TODO change to ObservableMap  
  @observable followers: IUser[] = [];
  @observable followings: IUser[] = [];
  // 
  @observable streams: IStream[] = [];

  @observable favorites: ITrack[] = [];
  @observable playlists: IPlaylist[] = [];


  isLoadings = {
    get: PerformanceStore.getLoadingStateWidthKey,
    set: PerformanceStore.setLoadingStateWithKey
  };
  nextHrefs = new ObservableMap<string>();
  userStore: UserStore;

  /**
   * @param obj 如果传入的是一个Iuser对象,直接去获取数据
   */
  constructor(userStore: UserStore, obj: number | IUser) {
    this.userStore = userStore
    if (typeof obj == 'number') {
      this.user = new User(obj)
      this.fetchUser()
    } else {
      this.setUser(obj)
    }
  }
  getAllTrackFromStreams(): ITrack[] {
    return this.streams.filter(stream => stream.track != null).map(s => s.track);
  }
  loadDataFromCookie() {

  }

  //TODO : type
  @action catchError({ err, fetchType }: ICatchErr) {
    logError(err);
    if (fetchType)
      this.resetLoadingState(fetchType);
    throw err;
  }

  @action fetchCommunityData() {
    this.fetchWithType(FETCH_FOLLOWERS);
    this.fetchWithType(FETCH_FOLLOWINGS);
    this.fetchWithType(FETCH_FAVORITES);
    // this.fetchWithType(FETCH_STREAM);
  }

  async fetchUser() {
    const url = apiUrl(`users/${this.user.userId}`, "?")
    try {
      const rawUser: any = await fetch(url)
        .then(data => data.json());
      this.user.updateFromServe(rawUser)
    } catch (err) {
      // this.catchError({ err });
    }
  }

  @action setUser(rawUser: IUser) {
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
  @action addData(type: string, fs: IUser[]) {
    const targetArr = this[type]
    if (!targetArr) {
      extendObservable(this[type], []);
    }
    let user: any = {}
    if (type === FETCH_FOLLOWERS) {
      fs.forEach(data => {
        user = new User(data)
        targetArr.push(user);
      })
    } else if (type === FETCH_FOLLOWINGS) {
      fs.forEach(data => {
        user = new User(data)
        targetArr.push(user);
        user.isFollowing = true

      })
    } else {
      fs.forEach(data => targetArr.push(data))
    }
  }

  apiStream(id: number) {
    return unauthApiUrlV2(`stream/users/${id}`
      , `limit=15&offset=0&linked_partitioning=1`)
  }

  @action async fetchWithType(type: string) {
    if (this.isLoadings.get(type)) {
      return
    }
    let id = this.user.userId;
    if (id == null) {
      return
    }
    let url = this.nextHrefs.get(type)
    // 
    const fetchType = type;

    if (url) {
      url = addAccessToken(url, '&')
    } else if (!url && this[type].length < 1) {
      // debugger
      switch (fetchType) {
        case FETCH_STREAM:
          url = this.apiStream(id);
          break
        default:
          url = `users/${id}/${type}`
          url = apiUrl(url + `?limit=${limitPageSize}&offset=0&linked_partitioning=1`, '&')

      }
    } else {
      return;
    }
    console.log(url);

    try {
      this.changeLoadingState(fetchType, true);
      const data: any = await fetch(url).then(response => response.json());
      if (Array.isArray(data)) {
        // debugger
        this.addData(type, data);
      } else {
        console.log(type, data)
        this.addData(type, data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
      }
    }
    catch (err) {
      this.catchError({ err, fetchType })
    } finally {
      this.changeLoadingState(fetchType, false)
    }
  }
}


const ActivitiesStore = new ActivitiesModel()
export { ActivitiesStore };
export default new UserStore();
