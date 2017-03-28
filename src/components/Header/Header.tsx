import * as React from 'react';
// import {observable,action} from 'mobx'
import { observer, inject } from "mobx-react";
// import { IUserStore } from "../../store/UserStore";
// import { IUser } from "./interfaces/interface";

import DevTool from 'mobx-react-devtools'
import { NavLink as Link } from 'react-router-dom'
const styles = require('./header.scss');

@inject("UserStore")
@observer
class Main extends React.Component<any, undefined> {

  loginIn = () => {
    const { UserStore } = this.props;
    UserStore.login();
  };
  componentDidMount() {
    this.props.UserStore.loadDataFromCookie();
  }

  render() {
    const { user } = this.props.UserStore;
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
            to='/users'>我的音乐</Link>
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
