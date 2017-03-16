import { observable, action } from "mobx";
import { FETCH_FOLLOWERS } from '../constants/fetchTypes'
const Cookies = require("js-cookie")
import {
  CLIENT_ID,
  REDIRECT_URI,
  OAUTH_TOKEN
} from "../constants/authentification";
import { ISession, IUser } from "../interfaces/interface";
const SC = require("soundcloud");
// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "UserStore" })
export interface IUserStore {
  session: string
  user: IUser;
  login: () => void;
  loadDataFromCookie: () => void;
  followers: IUser[];
}

const limitPageSize = 20;
class UserStore implements IUserStore {
  @observable session: any;
  @observable user: IUser;
  @observable followers: IUser[]
  @observable isFetchFollowersLoading: boolean = false;
  @observable isLogining: boolean = false;
  @observable isLoading: {} = {};
  oauth_token: string;
  loadDataFromCookie() {
    const oauth_token = Cookies.get(OAUTH_TOKEN)
    if (oauth_token) {
      this.fetchUser(oauth_token);
      this.oauth_token = oauth_token;
    }
  }
  //TODO : type
  @action catchError(err: any) {

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
      })
  }

  @action setUser(user: IUser) {
    this.user = user;
  }

  @action
  fetchFollowers(id: string, nextHref: string) {

    this.isLoading[FETCH_FOLLOWERS] = true;
    SC.get(`/users/${id}/followers`, { limit: limitPageSize, oauth_token: this.oauth_token })
      .then((followers: IUser[]) => {
        this.followers = followers;
        this.isLoading[FETCH_FOLLOWERS] = false
      }).catch((err: any) => {
        this.isLoading = false
        this.isLoading[FETCH_FOLLOWERS] = false
      })

  }
}



export default new UserStore();
