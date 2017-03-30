import {
  observable, action
  , ObservableMap
  // , runInAction
  // , autorun
  , extendObservable, computed,
  runInAction
  // , runInAction
  // , whyRun
} from "mobx";
import { FETCH_FOLLOWERS, FETCH_FAVORITES, FETCH_FOLLOWINGS, FETCH_ACTIVITIES } from '../constants/fetchTypes'
import {
  IUser
  // , IMePeopels
  , IActivitiesItem
} from "../interfaces/interface";
import { addAccessToken, apiUrl } from "../services/soundcloundApi";
import { ITrack } from "./index";
import { BaseAct } from "./TrackStore";
// const SC = require("soundcloud");
// const Cookies = require("js-cookie")
// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "UserModel" })
export interface IUserModel {
  user: IUser;
  loadDataFromCookie: () => void;
  followers: IUser[];
  followings: IUser[];
  favorites: ITrack[];
  isLoadings: ObservableMap<boolean>
  nextHrefs: {}
  fetchWithType: (type: string) => void
  fetchCommunityData: () => void
  // fetchFollowers: (nextHref: string, id?: number, ) => void;
}

interface ICatchErr {
  err: any
  fetchType?: string;
}
const limitPageSize = 20;


export interface IActivitiesStore {
  fetchNextActivities: () => void;
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
    return items.map(this.getAllTrackFromActivity);
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
          // console.log(b)
          return !b;
        })
        this.addActivities(filterArr);
      })
  }

  @action setLoadingActivities(b: boolean) {
    this.setLoadingByGenre(FETCH_ACTIVITIES, b);
  }

  @action fetchNextActivities() {
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
      console.log(data)
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
  fetchUserData: (id: number) => void;
  userModel: IUserModel
  isLoginUser: boolean
}


export class UserList implements IUserStore {
  users = new ObservableMap<UserModel>()
  @observable userModel: IUserModel
  loginedUserId: number
  constructor() { }

  initUser(obj: number | IUser): IUserModel {
    const isNumber = typeof obj === 'number'
    let id = isNumber ? obj : ((<IUser>obj).id)
    let user = this.users.get(id + "")
    if (!user) {
      user = new UserModel(obj)
      this.users.set(id + "", user)
    } else if (!isNumber) {
      user.setUser(<IUser>obj)
    }
    this.setCurrentUserModel(user)
    return user;
  }
  @action setCurrentUserModel(model: IUserModel) {
    this.userModel = model
  }

  @computed get isLoginUser() {
    return this.loginedUserId === (this.userModel.user && this.userModel.user.id)
  }

  setLoginUserModel(userId: number) {
    this.loginedUserId = userId
  }

  fetchUserData(id: number) {
    const user = this.users.get(id + "")
    if (user) {
      user.fetchUser()
      this.setCurrentUserModel(user)
    }
    return this;
  }

  @computed get AllUsersFavorities(): ITrack[] {
    const tracks: ITrack[] = []
    this.users.values().forEach((model) => {
      tracks.push(...model.favorites)

    })
    return tracks;
  }
}

/**
 * 以 用户id为key,保存数据
 */
class UserModel implements IUserModel {
  @observable user: IUser;
  // TODO change to ObservableMap
  @observable followers: IUser[] = [];
  @observable followings: IUser[] = [];
  @observable favorites: ITrack[] = [];

  isLoadings = new ObservableMap<boolean>();
  nextHrefs = new ObservableMap<string>();
  userId: number
  /**
   * 
   * @param obj 如果传入的是一个Iuser对象,直接去获取数据
   */
  constructor(obj: number | IUser) {

    if (typeof obj == 'number') {
      this.userId = obj
      this.fetchUser()
    } else {
      this.setUser(obj)
    }
  }

  loadDataFromCookie() {

  }
  //TODO : type
  @action catchError({ err, fetchType }: ICatchErr) {
    console.error(err);
    if (fetchType) this.resetLoadingState(fetchType);
    throw err;
  }

  @action fetchCommunityData() {
    this.fetchWithType(FETCH_FOLLOWERS);
    this.fetchWithType(FETCH_FOLLOWINGS);
    this.fetchWithType(FETCH_FAVORITES);
  }
  @action fetchUser() {
    const url = apiUrl(`users/${this.userId}`, "?")
    fetch(url)
      .then(data => data.json())
      .then((rawuser: any) => {
        this.setUser(rawuser)
      }).catch(err => {
        this.catchError(err);
      })
  }

  @action setUser(user: IUser) {
    this.user = user;
    this.userId = user.id
    // this.fetchCommunityData()

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
  @action addFollowers(fs: IUser[]) {
    fs.forEach(follower => {
      this.followers.push(follower);
    })
  }

  @action addData(type: string, fs: IUser[]) {
    const targetArr = this[type]
    if (!targetArr) {
      extendObservable(this[type], []);
    }
    fs.forEach(follower => {
      targetArr.push(follower);
    })
  }

  @action async fetchWithType(type: string) {
    if (this.isLoadings.get(type)) {
      return
    }
    let id = this.userId;
    if (id == null) {
      //todo 
      return
    }
    let url = this.nextHrefs.get(type)
    if (url) {
      url = addAccessToken(url, '&')
    } else if (!url && this[type].length < 1) {
      // debugger
      switch (type) {
        case FETCH_FOLLOWERS:
          url = `users/${id}/followers`
          break
        case FETCH_FOLLOWINGS:
          url = `users/${id}/followings`
          break
        case FETCH_FAVORITES:
          url = `users/${id}/favorites`
          break
      }
      url = apiUrl(url + `?limit=${limitPageSize}`, '&')
    } else {
      console.log('Does has more nextHref it is done!', this[type])
      return;
    }

    const fetchType = type;

    try {
      this.changeLoadingState(fetchType, true);
      const data: any = await fetch(url).then(response => response.json());
      if (Array.isArray(data)) {
        // debugger
        this.addData(type, data);
      } else {
        this.addData(type, data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
      }
      this.changeLoadingState(fetchType, false);
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
export default new UserList();
