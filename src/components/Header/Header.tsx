import * as React from 'react';
import { observer, inject } from "mobx-react";
import DevTool from 'mobx-react-devtools'
import Link from '../StyleLink'
import {
  // NavLink as L,
  withRouter
} from 'react-router-dom'
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
  componentWillReceiveProps(nextProps: any) {

    console.log(nextProps)
  }
  render() {

    const { user } = this.props.SessionStore;
    console.log('hehehehehehehe')
    return (
      <section className={styles.main}>
        <div className={styles.title}>
          <h1><Link to="/">MUSIC</Link></h1>
        </div>
        <nav>
          <Link

            to="/main">主页</Link>
          <Link
            to="/ssr"
          >SSR</Link>
          <Link
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
export default withRouter(Main);
