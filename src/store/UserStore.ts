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
  CLIENT_ID,
  REDIRECT_URI,
  OAUTH_TOKEN
} from "../constants/authentification";
import {
  ISession, IUser
  // , IMePeopels
  , IActivitiesItem
} from "../interfaces/interface";
import { addAccessToken, apiUrl } from "../services/soundcloundApi";
import { ITrack } from "./index";
const SC = require("soundcloud");
const Cookies = require("js-cookie")
// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "UserStore" })
export interface IUserStore {
  session: string
  user: IUser;
  login: () => void;
  loadDataFromCookie: () => void;
  followers: IUser[];
  followings: IUser[];
  favorites: ITrack[];
  isLoadings: ObservableMap<boolean>
  nextHrefs: {}
  fetchWithType: (type: string) => void
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

class UserStore implements IUserStore {
  @observable session: any;
  @observable user: IUser;
  // TODO change to ObservableMap
  @observable followers: IUser[] = [];
  @observable followings: IUser[] = [];
  @observable favorites: ITrack[] = [];

  @observable isFetchFollowersLoading: boolean = false;
  isLoadings = new ObservableMap<boolean>();
  nextHrefs = new ObservableMap<string>();
  oauth_token: string;
  constructor(private actsStore: ActivitiesModel) {

  }

  loadDataFromCookie() {

    const oauth_token = Cookies.get(OAUTH_TOKEN)
    if (oauth_token) {
      this.fetchUser(oauth_token);
      this.oauth_token = oauth_token;
    }
  }
  //TODO : type
  @action catchError({ err, fetchType }: ICatchErr) {
    console.error(err);
    if (fetchType) this.resetLoadingState(fetchType);
    throw err;

  }
  @action login() {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });
    SC.connect().then((session: ISession) => {
      Cookies.set(OAUTH_TOKEN, session.oauth_token);
      this.oauth_token = session.oauth_token;
      this.session = session;
      this.fetchUser(session.oauth_token);
    }).catch((err: any) => {
      this.catchError(err);
    });
  }

  @action fetchUser(oauth_token: string) {
    fetch(`https://api.soundcloud.com/me?oauth_token=${oauth_token}`)
      .then(data => data.json())
      .then((rawuser: any) => {
        this.setUser(rawuser)
        this.fetchWithType(FETCH_FOLLOWERS, rawuser.nextHref);
        this.fetchWithType(FETCH_FOLLOWINGS, rawuser.nextHref);
        this.fetchWithType(FETCH_FAVORITES, rawuser.nextHref);
        this.actsStore.fetchActivities();
      }).catch(err => {
        this.catchError(err);
      })
  }

  @action setUser(user: IUser) {
    this.user = user;
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
      id = this.user.id;
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
export default new UserStore(ActivitiesStore);
