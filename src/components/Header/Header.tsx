import * as React from 'react';
import { observer, inject } from 'mobx-react';
import DevTool from 'mobx-react-devtools'
import Link from '../StyleLink'
import {
  withRouter
} from 'react-router-dom'
import { ISessionStore } from '../../store/index';
const styles = require('./header.scss');

interface IHeaderProp {
  SessionStore: ISessionStore
}
const StyleButton = (props: any) => {
  return <button type="button">{props.children} </button>;
};

@inject('SessionStore')
@observer
class Header extends React.Component<IHeaderProp, undefined> {

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
      <section className={styles._aside}>
        <div className={styles._aside_header}>
          <div className={styles._aside_header_img}>
            <img
              alt="#"
              style={{
                width: '50px',
                height: '50px'
              }}
            />
          </div>
          <ul className={styles._aside_header_ul}>
            <li><StyleButton>Library</StyleButton></li>
            <li>
              <Link to="/"><StyleButton>Browse</StyleButton>
              </Link>
            </li>
            <li>
              <Link to="/ssr"><StyleButton>Radio</StyleButton>
              </Link>
            </li>
            <li>
              <Link
                to={{
                  pathname: '/users/home',
                  search: `?id=${user && user.id}`
                }}
              >
                <StyleButton>home</StyleButton>
              </Link>
            </li>
          </ul>
        </div>
        <div className={styles._aside_mymusic}>
          <div className={styles._aside_title}>
            MY Music
            </div>
          <ul className={styles._aside_header_ul}>
            <li><StyleButton> <i className="fa fa-star" /> likes </StyleButton> </li>
            <li><StyleButton> <i className="fa fa-music" /> Tracks </StyleButton> </li>
            <li><StyleButton> <i className="fa fa-users" /> Followings</StyleButton> </li>
            <li><StyleButton> <i className="fa fa-user" /> Followers</StyleButton> </li>
            {/*wating*/}
            {/*<li><StyleButton> <i>o</i> Albums</StyleButton> </li>
            <li><StyleButton> <i>o</i> Recent</StyleButton> </li>
            <li><StyleButton> <i>o</i> Local </StyleButton> </li>
            <li><StyleButton> <i>o</i> Arists</StyleButton> </li>*/}
          </ul>
        </div>
        <div className={styles._aside_playlist}>
          <div className={styles._aside_title}>
            <span> MY PLAYLIST </span> <i className="fa fa-plus " />
          </div>
          <ul className={styles._aside_header_ul}>
            <li><StyleButton> <i>🎶</i> Recent</StyleButton> </li>
            <li><StyleButton> <i>🎶</i> Local </StyleButton> </li>
            <li><StyleButton> <i>🎶</i> Albums</StyleButton> </li>
            <li><StyleButton> <i>🎶</i> Arists</StyleButton> </li>
          </ul>
        </div>
        {/*{
          <button onClick={this.loginIn}>{user ? "Loginout" : 'Login'}</button>
        }*/}
        <DevTool />
      </section>
    );
  }
}
export default withRouter(Header);
