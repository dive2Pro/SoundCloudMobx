import {
  observable, action
} from 'mobx';
import {
  REDIRECT_URI,
  OAUTH_TOKEN,
  MY_CLIENT_ID
} from '../constants/authentification';
import {
  ISession
} from '../interfaces/interface';
import UserList from './UserStore'
import { apiUrl } from '../services/soundcloundApi';
const SC = require('soundcloud');
const Cookies = require('js-cookie')
import { User } from './UserStore'


interface ICatchErr {
  err: any
  fetchType?: string;
}
/**
 * 
 */
export class SessionStore {
  @observable session: any;
  @observable user: User | undefined;
  oauth_token: string;

  loadDataFromCookie() {
    const oauth_token = Cookies.get(OAUTH_TOKEN);

    if (oauth_token && oauth_token != 'null') {
      this.fetchUser(oauth_token);
      this.oauth_token = oauth_token;
      return true
    }
    return false;
  }

  //TODO : type
  @action catchError({ err, fetchType }: ICatchErr) {
    // console.error(err);
    throw err;
  }
  @action login() {
    if (this.loadDataFromCookie()) { return }
    SC.initialize({ client_id: MY_CLIENT_ID, redirect_uri: REDIRECT_URI });
    SC.connect().then((session: ISession) => {
      Cookies.set(OAUTH_TOKEN, session.oauth_token);
      this.oauth_token = session.oauth_token;
      this.session = session;
      this.fetchUser(session.oauth_token);
    }).catch((err: any) => {
      this.catchError(err);
    });
  }
  @action loginout() {
    this.oauth_token = '';
    this.session = null;
    Cookies.set(OAUTH_TOKEN, null);
    this.user = undefined
    UserList.setLoginUserModel(undefined)
  }
  // tslint:disable-next-line:variable-name
  @action fetchUser(oauth_token: string) {
    const url = apiUrl(`me`, '?')
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

  @action setUser(user: User) {
    this.user = user;
  }
}
export default new SessionStore();