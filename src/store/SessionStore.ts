import {
  observable, action
} from "mobx";
import {
  CLIENT_ID,
  REDIRECT_URI,
  OAUTH_TOKEN
} from "../constants/authentification";
import {
  ISession, IUser
} from "../interfaces/interface";
// import TrackStore from './TrackStore'
import UserList from './UserStore'
import { apiUrl } from "../services/soundcloundApi";
const SC = require("soundcloud");
const Cookies = require("js-cookie")

// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "SessionStore" })
export interface ISessionStore {
  session: string
  user: IUser;
  login: () => void;
  loadDataFromCookie: () => void;
}

interface ICatchErr {
  err: any
  fetchType?: string;
}
/**
 * 
 */
class SessionStore implements ISessionStore {
  @observable session: any;
  @observable user: IUser;
  oauth_token: string;


  loadDataFromCookie() {
    const oauth_token = Cookies.get(OAUTH_TOKEN);
    if (oauth_token) {
      this.fetchUser(oauth_token);
      this.oauth_token = oauth_token;
      return true
    }
    return false;
  }

  //TODO : type
  @action catchError({ err, fetchType }: ICatchErr) {
    console.error(err);
    throw err;
  }
  @action login() {
    if (this.loadDataFromCookie()) return
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
    const url = apiUrl(`me`, "?")
    fetch(url)
      .then(data => data.json())
      .then((rawuser: any) => {
        this.setUser(rawuser)
        UserList.initUser(rawuser);
        UserList.setLoginUserModel(rawuser.id)
      }).catch(err => {
        this.catchError(err);
      })
  }

  @action setUser(user: IUser) {
    this.user = user;
  }
}
export default new SessionStore();