import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { observer, inject } from 'mobx-react';
import DevTool from 'mobx-react-devtools'
import Link from '../StyleLink'
import ButtonInline from '../ButtonInline'
import {
  withRouter
} from 'react-router-dom'
import { ISessionStore, SessionStore as SS } from '../../store/index';
const styles = require('./header.scss');
import ArtWork from '../ArtWork'
import { observable, action } from '._mobx@3.1.8@mobx/lib/mobx';
import { IUser } from '../../interfaces/interface';
import { IUserStore } from '../../store/UserStore';
interface IHeaderProp {
  SessionStore: ISessionStore
}


class widhtRouterStyleLink extends React.PureComponent<{ to?: string | Object, children?: any }, any> {
  render() {
    const { to } = this.props
    return (
      <Link
        to={to || 'abondan'}
        activeClassName={styles.aside_hover}
        exact={to == '/'}
      >
        {this.props.children}
      </Link>)
  }
}
const StyleButton =
  // widhtRouterStyleLink
  withRouter(widhtRouterStyleLink);


interface IDropDownProps {
  store: ISessionStore
}

@observer
class DropDown extends React.PureComponent<IDropDownProps, any>{
  dropdownContent: any;
  @observable dropdowning: boolean = false

  handleSign = () => {
    const { store } = this.props
    if (!store.user) {
      store.login()
    } else {
      store.loginout()
    }
  }

  @action toggleDropdowning = () => {
    this.dropdowning = !this.dropdowning;
  }


  componentDidMount() {
    document.addEventListener('mousedown', this.onOutsideClick);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onOutsideClick);
  }

  @action onOutsideClick = (e: any) => {

    if (!this.dropdowning) {
      return;
    }

    e.stopPropagation();
    const localNode = ReactDOM.findDOMNode(this);
    let source = e.target;

    while (source.parentNode) {
      if (source === localNode) {
        return;
      }
      source = source.parentNode;
    }
    this.toggleDropdowning()
  }

  render() {
    const clazz = this.dropdowning ? styles.dropdown_content_visible : styles.dropdown_content;
    const { user } = this.props.store

    const aturl = user && user.avatar_url || ''
    return (
      <div className={styles.dropdown}>
        <ArtWork
          onClick={this.toggleDropdowning}
          style={{
            width: '50px',
            height: '50px'
          }}
          src={aturl}
          live={true}
        />
        <div
          className={clazz}
        >
          <ButtonInline onClick={this.handleSign}>
            {!user ? 'Sign into SoundCloud' : 'Sign out'}
          </ButtonInline>
        </div>
      </div >
    )
  }
}

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
          {/*onClick={}*/}
          <div
            className={styles._aside_header_img}>

            <DropDown
              store={this.props.SessionStore}
            />
          </div>
          <ul className={styles._aside_header_ul}>
            <li>
              <StyleButton>Library</StyleButton>
            </li>
            <li>
              <StyleButton to="/main">Browse</StyleButton>
            </li>
            <li>
              <StyleButton to="/ssr">Radio</StyleButton>
            </li>
            <li>
              <StyleButton
                to={{
                  pathname: '/users',
                  search: `?id=${user && user.id}`
                }}
              >home
              </StyleButton>
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
        <DevTool />
      </section>
    );
  }
}
export default withRouter(Header);
