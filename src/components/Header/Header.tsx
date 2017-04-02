import * as React from 'react';
import {
  observer
  , inject
} from "mobx-react";
import DevTool from 'mobx-react-devtools'
import Link from '../StyleLink'
import { ISessionStore } from "../../store/index";
import { observable } from ".3.1.7@mobx/lib/mobx";

const styles = require('./header.scss');

interface IHeaderProp {
  SessionStore: ISessionStore
}
@inject("SessionStore")
@observer
class Main extends React.Component<IHeaderProp, undefined> {
  @observable currentLink = ''
  loginIn = () => {
    const { SessionStore } = this.props;
    SessionStore.login();
  };
  componentDidMount() {
    this.props.SessionStore.loadDataFromCookie();
  }

  render() {

    const { user } = this.props.SessionStore;
    return (
      <section className={styles.main}>
        <div className={styles.title}>
          <h1>
            <Link
              to="/">MUSIC</Link></h1>
        </div>
        <nav>
          <Link
            to="/main/genre=country">主页</Link>

          <Link
            to="/main/ssr"
            render={() => {
              return <div>laallaalalalal</div>
            }}
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
export default Main;
