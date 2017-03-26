import {
  observable, action
  , ObservableMap
  // , runInAction
  , extendObservable, computed
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
  isLoadings: {}
  nextHrefs: {}
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

  @action setNextActivitiesHref(nextHref: string) {
    this.activities_nextHref$ = nextHref;
  }

  @action addActivities(arr: IActivitiesItem[]) {
    this.activities.push(...arr);
  }

  @action setFilterTitle(title: string) {
    this.filterTitle = title;
  }
  @action setSortType(type: string) {
    this.sortType = type;
  }

  @computed get filteredTracks() {
    return this.filteredActivities ? this.filteredActivities.map((item) => item.origin) : []
  }

  filterActivities(arr: IActivitiesItem[]) {
    Promise.resolve(arr)
      .then(data => {
        const filterArr = data.filter(item => {
          const b = this.activities.some(active => active.created_at === item.created_at)
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
    let activitiesUrl;
    if (nextHref) {
      activitiesUrl = addAccessToken(nextHref, '&');
    } else {
      activitiesUrl = apiUrl(`me/activities?limit=50`, '&')
    }
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

  @computed get filteredActivities(): IActivitiesItem[] {
    let fs = this.activities;
    if (!!this.filterType) {
      fs = fs.filter(item => {
        return item.type === this.filterType
      })
    }

    if (!!this.sortType) {
      fs = fs.sort((p, n) => {
        let pCount = p.origin[this.sortType];
        let nCount = n.origin[this.sortType];
        pCount = !Number.isNaN(pCount) ? pCount : 0;
        nCount = !Number.isNaN(nCount) ? nCount : 0;
        return nCount - pCount;
      })
    }

    if (!!this.filterTitle) {
      fs = fs.filter(item => {
        return item.origin.title.indexOf(this.filterTitle) > -1
      })
    }

    return fs;
  }

  @computed get activitiesCount() {
    return this.activities.length;
  }
}

class UserStore implements IUserStore {
  @observable session: any;
  @observable user: IUser;
  @observable followers: IUser[] = [];
  @observable followings: IUser[] = [];
  @observable favorites: ITrack[] = [];
  @observable isFetchFollowersLoading: boolean = false;
  isLoadings = new ObservableMap<boolean>();
  @observable nextHrefs: {} = {};
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
    this.nextHrefs[type] = nextHref
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

  @action async fetchWithType(type: string, nextHref: string, id?: number) {
    if (id == null) {
      id = this.user.id;
    }
    let url = ''
    switch (type) {
      case FETCH_FOLLOWERS:
        url = `/users/${id}/followers`
        break
      case FETCH_FOLLOWINGS:
        url = `/users/${id}/followings`
        break
      case FETCH_FAVORITES:
        url = `/users/${id}/favorites`
        break
    }
    const fetchType = type;
    this.changeLoadingState(fetchType, true);
    try {
      const data = await SC.get(url,
        { limit: limitPageSize, oauth_token: this.oauth_token });
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
