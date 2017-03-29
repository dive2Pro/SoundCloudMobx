import {
  observable, action
  , ObservableMap
  // , runInAction
  , autorun
  , extendObservable, computed, runInAction
  , whyRun
} from "mobx";
import { FETCH_FOLLOWERS, FETCH_FAVORITES, FETCH_FOLLOWINGS } from '../constants/fetchTypes'
import {
  IUser
  // , IMePeopels
  , IActivitiesItem
} from "../interfaces/interface";
import { addAccessToken, apiUrl } from "../services/soundcloundApi";
import { ITrack } from "./index";
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
  activitiesCount: number
  setFilterType: (type: string) => void;
  setSortType: (type: string) => void;
  setFilterTitle: (type: string) => void;
  filterType: string
  sortType: string,
  filteredTracks: ITrack[];
}

class ActivitiesModel implements IActivitiesStore {
  @observable isLoading: boolean
  @observable filterType: string
  @observable filterTitle: string
  @observable sortType: string
  @observable activities: IActivitiesItem[] = [];
  @observable activities_nextHref$: string;
  @observable tracks: ITrack[]
  @observable filteredActivities: IActivitiesItem[];
  constructor() {
    const handler = autorun(() => {
      this.filterFunc(this.activities, this.sortType, this.filterType)
    })
    whyRun(handler);
  }

  @action setNextActivitiesHref(nextHref: string) {
    this.activities_nextHref$ = nextHref;
  }

  @action addActivities(arr: IActivitiesItem[]) {
    this.activities.splice(this.activities.length, 0, ...arr);
  }

  @action setFilterTitle(title: string) {
    this.filterTitle = title;
  }
  @action setSortType(type: string) {
    this.sortType = type;
  }

  @computed get filteredTracks() {
    return this.filteredActivities
      ? this.filteredActivities.map((item) => item.origin) : []
  }

  filterActivities(arr: IActivitiesItem[]) {
    Promise.resolve(arr)
      .then(data => {
        const filterArr = data.filter(item => {
          const b =
            this.activities.some(active =>
              active.created_at === item.created_at)
          // console.log(b)
          return !b;
        })
        this.addActivities(filterArr);
      })
  }
  @action setLoadingActivities(b: boolean) {
    this.isLoading = b;
  }
  @action fetchNextActivities() {
    if (!this.isLoading)
      this.fetchActivities(this.activities_nextHref$);
  }
  @action async fetchActivities(nextHref?: string) {
    let activitiesUrl = nextHref ? addAccessToken(nextHref, '&') :
      apiUrl(`me/activities?limit=50`, '&')
    this.setLoadingActivities(true);
    fetch(activitiesUrl)
      .then(response => response.json())
      .then((data: any) => {
        this.setNextActivitiesHref(data.next_href)
        this.filterActivities(data.collection);
        this.setLoadingActivities(false)
      })
  }

  @action setFilterType(filterType: string = "") {
    this.filterType = filterType;
  }

  async filterFunc(activities: IActivitiesItem[], sortType: string, filterType: string) {
    let fs = activities
    fs = await this.filterByFilterTitle(fs);
    fs = await this.filterBySortType(fs);
    fs = await this.filterByFilterType(fs)
    runInAction(() => {
      this.filteredActivities = fs;
    })
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

  filterBySortType(fs: IActivitiesItem[]) {
    let temp = fs.slice();
    if (!!this.sortType) {
      temp = fs.sort((p, n) => {
        let pCount = p.origin[this.sortType];
        let nCount = n.origin[this.sortType];
        pCount = !Number.isNaN(pCount) ? pCount : 0;
        nCount = !Number.isNaN(nCount) ? nCount : 0;
        return nCount - pCount;
      })
    }
    return temp
  }
  filterByFilterTitle(fs: IActivitiesItem[]) {
    let temp = fs.slice();
    if (!!this.filterTitle) {
      temp = fs.filter(item => {
        return item.origin.title.indexOf(this.filterTitle) > -1
      })
    }
    return temp
  }

  @computed get activitiesCount() {
    return this.activities.length;
  }
}


export interface IUserStore {
  initUserById: (id: number | IUser) => IUserModel
  fetchUserData: (id: number) => void;
}
export class UserList {
  users = new ObservableMap<UserModel>()

  constructor() {

  }

  initUserById(id: number | IUser): IUserModel {
    let user = this.users.get(id + "")
    if (!user) {
      user = new UserModel(id)
      this.users.set(id + "", user)
    }
    return user;
  }

  fetchUserData(id: number) {
    const user = this.users.get(id + "")
    user && user.fetchUser()
    return this;
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
    const url = apiUrl(`users/${this.userId}`, "&")
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

  @action async fetchWithType(type: string, id?: number) {
    if (id == null) {
      id = this.userId;
    }
    let url = this.nextHrefs.get(type)
    if (url) {
      url = addAccessToken(url, '&')
    } else if (!url && this[type].length < 1) {
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
      console.log('Does has more nextHref it is done!')
      return;
    }

    const fetchType = type;

    this.changeLoadingState(fetchType, true);

    try {
      const data: any = await fetch(url).then(response => response.json());
      if (Array.isArray(data)) {
        this.addData(type, data);
      } else {
        this.addData(type, data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
        this.changeLoadingState(fetchType, false);
      }
    }
    catch (err) {
      this.catchError({ err, fetchType })
    }
  }
}


const ActivitiesStore = new ActivitiesModel()
export { ActivitiesStore };
export default new UserList();
