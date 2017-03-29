import * as React from 'react';
// import {observable,action} from 'mobx'
import {
  observer
  , inject
} from "mobx-react";
// import { IUserStore } from "../../store/UserStore";
// import { IUser } from "./interfaces/interface";

import DevTool from 'mobx-react-devtools'
import { NavLink as Link } from 'react-router-dom'
import { ISessionStore } from "../../store/index";

const styles = require('./header.scss');

interface IHeaderProp {
  SessionStore: ISessionStore
}
@inject("SessionStore")
@observer
class Main extends React.Component<IHeaderProp, undefined> {

  loginIn = () => {
    const { SessionStore } = this.props;
    SessionStore.login();
  };
  componentDidMount() {
    this.props.SessionStore.loadDataFromCookie();
  }

  render() {

    const { user } = this.props.SessionStore;
    const selected = styles.selected
    return (
      <section className={styles.main}>
        <div className={styles.title}>
          <h1><Link
            to="/" >MUSIC</Link></h1>
        </div>
        <nav>
          <Link
            activeClassName={selected}
            to="/main/genre=country">主页</Link>
          <Link
            activeClassName={selected}
            to={{
              pathname: '/users/home',
              search: `?id=${user && user.id}`
            }}>我的音乐</Link>
        </nav>

        {
          <button onClick={this.loginIn}>{user ? "Loginout" : 'Login'}</button>
        }
        <DevTool />
      </section>
    );
  }
}
export default Main;
