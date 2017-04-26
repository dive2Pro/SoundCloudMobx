import * as React from 'react';
import * as ReactDOM from 'react-dom'
import {observer, inject,IReactComponent} from 'mobx-react';
import {NavLink} from 'react-router-dom'
import LoadingSpinner from '../LoadingSpinner'
import {
    withRouter
} from 'react-router-dom'
import {FETCH_PLAYLIST, FETCH_QUERY} from '../../constants/fetchTypes'
const styles = require('./header.scss');
import {observable, action} from 'mobx';
import {UserStore, User} from '../../store/UserStore';
import {SessionStore} from '../../store/SessionStore';
import {SESSION_STORE, USER_STORE, TRACK_STORE} from '../../constants/storeTypes'
import SearchPanel from '../SearchPanel'
import {TrackStore} from '../../store/TrackStore';
interface IHeaderProp {
    sessionStore: SessionStore
    userStore: UserStore,
    trackStore: TrackStore
    location: any,
    history: any
}
import AuthImage from './AuthImage';
import Any = jasmine.Any;
import makeCatchoutside from "../../Hoc/makeCatchoutside";
interface IWidhtRouterStyleLinkProps {
    to?: string | Object
    isActive?: (match: any, location: any) => boolean
}

class WidhtRouterStyleLink extends React.PureComponent<IWidhtRouterStyleLinkProps, any> {
    render() {
        const {to, isActive} = this.props

        return (
            <NavLink
                to={to || '/abondan'}
                activeClassName={styles.aside_hover}
                exact={to === '/'}
                isActive={isActive}
            >
                {this.props.children}
            </NavLink>)
    }
}


const StyleLink =
    withRouter(WidhtRouterStyleLink);

@inject(SESSION_STORE, USER_STORE, TRACK_STORE)
@observer
@makeCatchoutside
class Header extends React.Component<IHeaderProp, any> {
    state={isOpen:false}

    toggleMenusShowing =(e)=>{
        console.log(this.state.isOpen)
        e.stopPropagation();
        e.preventDefault();
        this.setState(prev=>({isOpen:!prev.isOpen}))
    }

    handleTouchOutside=()=>{
        this.setState(prev=>({isOpen:false}))
    }

    handleAuthClick = ()=>{
        const {sessionStore:store} = this.props;
        if (!store.user) {
            store.login()
        } else {
            store.loginout()
        }
    }
    renderTop = () => {
        const {userStore, location, history, trackStore} = this.props
        return (
            <div className={styles._aside_header}>
                <div
                    className={styles._aside_header_img}
                >
                    <AuthImage
                        onClick={this.handleAuthClick}
                        store={this.props.sessionStore}
                    />
                </div>
                <div className={styles._aside_header_search}>
                    <SearchPanel
                        handleSearch={(value) => {
                            if (location.pathname !== 'main') {
                                history.push('/main')
                            }
                            trackStore.setGenre(`${FETCH_QUERY}_${value}`, function () {
                                return `tracks?linked_partitioning=1&limit=20&offset=0&q=${value}`
                            })
                        }}
                    />
                </div>
                <div
                    onClick={this.toggleMenusShowing}
                    className={styles._aside_header_bars}>
                    <i className="fa fa-bars fa-2x"/>
                </div>
            </div>
        )
    }

    renderMyPlaylist = () => {
        const loginModel = this.getLoginUserModel()
        if (!loginModel) {
            return (
                <noscript />
            )
        }
        const isLoading = loginModel.isLoading(FETCH_PLAYLIST);
        const isError = loginModel.isError(FETCH_PLAYLIST);

        return (
            <div className={styles._aside_playlist}>
                <div className={styles._aside_title}>
                    <span> MY PLAYLIST </span> <i className="fa fa-plus "/>
                </div>
                <ul className={styles._aside_header_ul}>
                    {
                        loginModel.playlists.map((item, i) => {
                            return (
                                <li key={`${item.id}- playlist -` + i}>
                                    <StyleLink
                                        isActive={(match: any, location: any) => {
                                            if (match) {
                                                return item.id == location.search.substr(4)
                                            }
                                            return false
                                        }}
                                        to={{
                                            pathname: `/playlist`
                                            , search: `?id=${item.id}`
                                        }}
                                    >
                                        <i>🎶</i> {item.title || item.label_name}
                                    </StyleLink>
                                </li>)
                        })
                    }
                </ul>
                <LoadingSpinner
                    isLoading={isLoading}
                    isError={isError}
                    onErrorHandler={() => loginModel.fetchWithType(FETCH_PLAYLIST)}
                />

            </div>
        )
    }
    isLoginUserActive = (user: User) =>
        (match: any, location: any) => {

            if (match) {
                return user && user.id == location.search.substr(4)
            }

            return false
        }
    renderMyCommuPaner = () => {

        const loginModel = this.getLoginUserModel()

        if (!loginModel) {
            return (
                <noscript />
            )
        }
        const {user} = loginModel
        const isActive = this.isLoginUserActive(user)
        return (
            <div className={styles._aside_mymusic}>
                <div className={styles._aside_title}>
                    MY Music
                </div>
                <ul className={styles._aside_header_ul}>
                    <li>
                        <StyleLink
                            isActive={isActive}
                            to={{
                                pathname: `/users/favorites`,
                                search: `?id=${user && user.id}`
                            }}
                        > <i className="fa fa-star"/> likes
                        </StyleLink>
                    </li>
                    <li>
                        <StyleLink>
                            <i className="fa fa-music"/> Tracks </StyleLink></li>
                    <li>
                        <StyleLink
                            isActive={isActive}
                            to={{
                                pathname: `/users/followings`,
                                search: `?id=${user && user.id}`
                            }}
                        >
                            <i className="fa fa-users"/> Followings
                        </StyleLink></li>
                    <li>
                        <StyleLink
                            isActive={isActive}

                            to={{
                                pathname: `/users/followers`,
                                search: `?id=${user && user.id}`
                            }}
                        > <i className="fa fa-user"/> Followers
                        </StyleLink></li>
                    {/*wating*/}
                    {/*<li><StyleLink> <i>o</i> Albums</StyleLink> </li>
                     <li><StyleLink> <i>o</i> Recent</StyleLink> </li>
                     <li><StyleLink> <i>o</i> Local </StyleLink> </li>
                     <li><StyleLink> <i>o</i> Arists</StyleLink> </li>*/}
                </ul>
            </div>
        )
    }
    loginIn = () => {
        const {sessionStore} = this.props;
        sessionStore.login();
    };

    componentDidMount() {
        this.props.sessionStore.loadDataFromCookie();
    }

    getLoginUserModel() {
        return this.props.userStore.getLoginUserModel;
    }

    renderBasicItems() {

        const loginModel = this.getLoginUserModel()

        return (
            <ul className={styles._aside_header_ul}>
                <li>
                    <StyleLink>Library</StyleLink>
                </li>
                <li>
                    <StyleLink to="/main">Browse</StyleLink>
                </li>
                <li>
                    <StyleLink to="/ssr">Radio</StyleLink>
                </li>
                <li>
                    {loginModel ?
                        (
                            <StyleLink
                                to={{
                                    pathname: '/users',
                                    search: `?id=${loginModel.user && loginModel.user.id}`
                                }}
                            >home
                            </StyleLink>
                        ) : ''}
                </li>
            </ul>
        )
    }

    render() {
        const menusStyle = this.state.isOpen?{display:'block'}:{};
        console.log(menusStyle)
        return (
            <section className={styles._aside}>
                {this.renderTop()}
                 <div
                     onClickCapture={this.toggleMenusShowing}
                     style={menusStyle} className={styles._menus} >
                    {this.renderBasicItems()}
                    {this.renderMyCommuPaner()}
                    {this.renderMyPlaylist()}
                </div>
            </section>
        );
    }
}
export default withRouter(Header)
