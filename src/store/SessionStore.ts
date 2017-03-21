import { observable, action, extendObservable } from "mobx";
import { FETCH_FOLLOWERS } from '../constants/fetchTypes'
import {
  CLIENT_ID,
  REDIRECT_URI,
  OAUTH_TOKEN
} from "../constants/authentification";
import { ISession, IUser, IMePeopels } from "../interfaces/interface";
const SC = require("soundcloud");
const Cookies = require("js-cookie")
// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "SessionStore" })
export interface ISessionStore {
  session: string
  user: IUser;
  login: () => void;
  loadDataFromCookie: () => void;
  followers: IUser[];
  isLoadings: {}
  nextHrefs: {}
  fetchFollowers: (nextHref: string, id?: number, ) => void;
}

interface ICatchErr {
  err: any
  fetchType?: string;
}

const limitPageSize = 20;

class SessionStore implements ISessionStore {
  @observable session: any;
  @observable user: IUser;
  @observable followers: IUser[] = [];
  @observable isFetchFollowersLoading: boolean = false;
  @observable isLoadings: {} = {};
  @observable nextHrefs: {} = {};
  oauth_token: string;
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
        this.fetchFollowers(rawuser.id, rawuser.nextHref);
      }).catch(err => {
        this.catchError(err);
      })
  }

  @action setUser(user: IUser) {
    this.user = user;
  }

  @action changeLoadingState(type: string) {
    const specifyType = this.isLoadings[type];
    if (specifyType == null) {
      extendObservable(this.isLoadings, { [type]: true });
    } else {
      this.isLoadings[type] = !this.isLoadings[type];
    }

  }
  @action changeNextHrefs(type: string, nextHref: string) {
    this.nextHrefs[type] = nextHref
  }
  @action resetLoadingState(type: string) {
    this.isLoadings[type] = false;
  }
  @action addFollowers(fs: IUser[]) {
    fs.forEach(follower => {
      this.followers.push(follower);
    })
  }
  @action
  fetchFollowers(nextHref: string, id?: number) {
    if (id == null) {
      id = this.user.id;
    }
    const fetchType = FETCH_FOLLOWERS;
    this.changeLoadingState(fetchType);
    SC.get(`/users/${id}/followers`, { limit: limitPageSize, oauth_token: this.oauth_token })
      .then((data: IMePeopels) => {
        this.addFollowers(data.collection);
        this.changeNextHrefs(fetchType, data.next_href);
        this.changeLoadingState(fetchType);
      }).catch((err: any) => {
        this.catchError({ err, fetchType })
      })
  }
}

export default new SessionStore();