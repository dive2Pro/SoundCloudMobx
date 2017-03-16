import { observable, action } from "mobx";
const  Cookies = require( "js-cookie")
import {
  CLIENT_ID,
  REDIRECT_URI,
  OAUTH_TOKEN
} from "../constants/authentification";
const SC = require("soundcloud");
// const Remotedev = require("mobx-remotedev");
// @Remotedev({ name: "UserStore" })

class UserStore {
  @observable session: any;
  @action async login() {
    SC.initialize({ client_id: CLIENT_ID, redirect_uri: REDIRECT_URI });
    SC.connect().then((session: Session) => {
      Cookies.set(OAUTH_TOKEN, session.oauth_token);
      this.session = session;
      this.fetchUser(session.oauth_token);
    }).catch((err:any)=>{
      console.error(err);
    });
  }
  @action fetchUser(oauth_token: string) {}
}
export default new UserStore();
