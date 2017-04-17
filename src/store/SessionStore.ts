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
    const token = Cookies.get(OAUTH_TOKEN);
    if (token && token !== 'null') {
      this.fetchUser(token);
      this.oauth_token = token;
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
    const rawUser: any = {
      id: 278227204
      , kind: "user"
      , permalink: "huang-alex-635833920"
      , username: "Huang Alex"
      , last_modified: "2017/03/31 08:35:22 +0000"
      , uri: "https://api.soundcloud.com/users/278227204"
      , permalink_url: "http://soundcloud.com/huang-alex-635833920"
      , avatar_url: "https://i1.sndcdn.com/avatars-000286355267-ibfmck-large.jpg"
      , country: null
      , first_name: "Huang"
      , last_name: "Alex"
      , full_name: "Huang Alex"
      , description: "know when I get rejec", city: null
      , discogs_name: null, myspace_name: null, website: null
      , website_title: null, track_count: 0,
      playlist_count: 3
      , online: false, "plan": "Free", subscriptions: [], upload_seconds_left: 10800
      , quota: {
        unlimited_upload_quota: false, upload_seconds_used: 0
        , upload_seconds_left: 10800
      }, private_tracks_count: 0, private_playlists_count: 0
      , primary_email_confirmed: true, locale: "", followers_count: 9
      , followings_count: 77, public_favorites_count: 28, reposts_count: 4
    }
    UserList.initUser(rawUser);
    UserList.setLoginUserModel(rawUser.id)
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