import { observable, action } from "mobx";
import { FETCH_FOLLOWERS } from '../constants/fetchTypes'
const Cookies = require("js-cookie")
import {
  CLIENT_ID,
  REDIRECT_URI,
  OAUTH_TOKEN
} from "../constants/authentification";
import { ISession, IUser, IMePeopels } from "../interfaces/interface";
const SC = require("soundcloud");
// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "UserStore" })
export interface IUserStore {
  session: string
  user: IUser;
  login: () => void;
  loadDataFromCookie: () => void;
  followers: IUser[];
  isLoadings: {};
}
interface ICatchErr {
  err: any
  fetchType?: string;
}
const limitPageSize = 20;
class UserStore implements IUserStore {
  @observable session: any;
  @observable user: IUser;
  @observable followers: IUser[] = [];
  @observable isFetchFollowersLoading: boolean = false;
  @observable isLogining: boolean = false;
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

  }
  @action login() {
    this.isLogining = true;
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });
    SC.connect().then((session: ISession) => {
      Cookies.set(OAUTH_TOKEN, session.oauth_token);
      this.oauth_token = session.oauth_token;
      this.session = session;
      this.fetchUser(session.oauth_token);
      this.isLogining = false;
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
    this.isLoadings[type] = !this.isLoadings[type];
  }

  @action resetLoadingState(type: string) {
    this.isLoadings[type] = false;
  }
  @action addFollowers(fs:IUser[]) {
    fs.forEach(follower => {
          this.followers.push(follower);
        })
  }
  @action
  fetchFollowers(id: string, nextHref: string) {
    const fetchType = FETCH_FOLLOWERS;
    this.changeLoadingState(fetchType);
    this.isLoadings[FETCH_FOLLOWERS] = true;
    SC.get(`/users/${id}/followers`, { limit: limitPageSize, oauth_token: this.oauth_token })
      .then((data: IMePeopels) => {
        this.addFollowers(data.collection);
        this.nextHrefs[FETCH_FOLLOWERS] = data.next_href;
        this.changeLoadingState(fetchType);
      }).catch((err: any) => {
        this.catchError({ err, fetchType })
      })
  }
}



export default new UserStore();
