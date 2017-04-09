import {
  observable
  , action
  , ObservableMap
  , extendObservable
  , computed
  , runInAction
  , isObservable
  ,
} from 'mobx';
import {
  FETCH_FOLLOWERS
  , FETCH_FAVORITES
  , FETCH_FOLLOWINGS
  , FETCH_ACTIVITIES
  , FETCH_STREAM
  , FETCH_USER
  , FETCH_PLAYLIST
} from '../constants/fetchTypes'
import {
  IUser
  , IActivitiesItem,
  IPlaylist,
  IStream
} from '../interfaces/interface';
import {
  addAccessToken, apiUrl,
  unauthApiUrlV2
  ,
} from '../services/soundcloundApi';
import { ITrack } from './index';
import { BaseAct, IBaseActStore } from './TrackStore';
import PerformanceStore from './PerformanceStore'
import {
  logError

} from '../services/logger'
import { RaceFetch as fetch } from '../services/Fetch'
// import { extendsObservableObjFromJson } from '../services/utils';

interface ICatchErr {
  err: {
    type: string,
    msg: string
  }
  fetchType?: string;
}
const limitPageSize = 20;

export interface IActivitiesStore extends IBaseActStore {

  fetchNextActivities: (first?: boolean) => void;
  filteredActivities: IActivitiesItem[];

  setFilterType: (type: string) => void;
  setFilterTitle: (type: string) => void
  setSortType: (type: string) => void;

  filterType: string
  sortType: string,
  filteredTracks: ITrack[];

}

class ActivitiesModel extends BaseAct<IActivitiesItem> implements IActivitiesStore {
  @observable filteredActivities: IActivitiesItem[];
  constructor() {
    super(FETCH_ACTIVITIES)
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
    if (!this.isLoading) {
      this.fetchActivities(this.nextHref);
    }
  }
  @action async fetchActivities(nextHref?: string) {
    let activitiesUrl = nextHref ? addAccessToken(nextHref, '&') :
      apiUrl(`me/activities?limit=50`, '&')
    try {
      this.setLoadingActivities(true);
      const data: any = await fetch(activitiesUrl)
      // const data = await rawData.json();
      runInAction(() => {
        this.setNextActivitiesHref(data.next_href)
        this.filterActivities(data.collection);
        this.setLoadingActivities(false)
      })
    } catch (err) {
      this.catchErr(err, this.currentGenre)
    }
    finally {
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
  getLoginUserModel: () => IUserModel
}

export class UserStore implements IUserStore {

  userModels = new ObservableMap<UserModel>()
  // 当前的登录用户
  loginModel: IUserModel
  @observable userModel: IUserModel
  loginedUserId: number | undefined

  initUser(obj: number | IUser): IUserModel {
    const isNumber = typeof obj === 'number'
    let id = isNumber ? obj : ((<IUser>obj).id)
    let userModel = this.userModels.get(id + '')
    if (!userModel) {
      userModel = new UserModel(this, obj)
      this.userModels.set(id + '', userModel)
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

  @computed get isLogined() {
    return this.loginedUserId != null
  }

  setLoginUserModel(userId: number | undefined) {
    this.loginedUserId = userId
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



  findPlaylistFromCurrentUser(id: number): IPlaylist {

    return <IPlaylist>this.userModel.playlists.find((item) => item.id === id)

  }



  /**
   * follow用户
   * todo fix 404
   */
  async followUser(user: IUser) {
    // todo 添加modal
    if (!this.getLoginUserModel()) {
      return
    }
    const { id, isFollowing } = user
    // const isFollowing = await this.isFollowingUser(id)
    const raw: any = await fetch(apiUrl(`me/followings/${id}`, '?')
      // , {
      // method: isFollowing ? 'delete' : 'put'
      // }
    )
    const data = await raw.json()
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
// 目前不做歌单项目, 只能从用户那里过来
// class PlaylistStore {

//   优化内存的使用
//   combineUserPlaylist() {

//   }

export interface IUserModel {
  user: User;
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
  @observable isFollowing: boolean = false

  constructor(obj: IUser | number) {
    if (typeof obj === 'number') {
      this.userId = obj
      return this;
    } else {
      this.userId = obj.id
      this.updateFromServe(obj);
    }
  }

  @action updateFromServe = (rawUser: IUser) => {
    // extendsObservableObjFromJson(this, rawUser);
    // _.assignInWith(this, _.cloneDeep(rawUser))
    for (let p in rawUser) {
      if (!isObservable(this[p])) {
        this.objMap.set(p, rawUser[p]);
        Object.defineProperty(this, p, {
          get: () => {
            return this.objMap.get(p);
          }
        })
      }
    }

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
  constructor(userStore: UserStore, obj: number | IUser) {
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
    // 除了是登录用户外,

    if (type === FETCH_FOLLOWERS || type === FETCH_FOLLOWINGS) {
      fs.forEach(data => {
        user = new User(data)
        targetArr.push(user)
        if (this.userStore.isLogined) {
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
        this.addData(type, data);
      } else {
        this.addData(type, data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
      }
    } catch (err) {
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


const ActivitiesStore = new ActivitiesModel()
export { ActivitiesStore };
export default new UserStore();
