import * as React from 'react';
import {observer, inject} from 'mobx-react';
import LoadingSpinner from '../LoadingSpinner'
import {withRouter, location, history} from 'react-router-dom'
import {FETCH_PLAYLIST, FETCH_QUERY} from '../../constants/fetchTypes'
const styles = require('./header.scss');
import {Motion, spring, presets} from 'react-motion'
const NavLink = require("react-router-dom").NavLink;
import {UserStore, User, UserModel} from '../../store/UserStore';
import {SessionStore} from '../../store/SessionStore';
import {SESSION_STORE, USER_STORE, TRACK_STORE, PERFORMANCE_STORE} from '../../constants/storeTypes'
import SearchPanel from '../SearchPanel'
import {TrackStore} from '../../store/TrackStore';
const diveMusicPng = require('../../../public/images/divemusic.png')




interface IHeaderProp {
    sessionStore: SessionStore
    userStore: UserStore,
    trackStore: TrackStore
    performanceStore: PerformanceStore
    location: location,
    history: history
}
import AuthImage from './AuthImage';
import Any = jasmine.Any;
import makeCatchoutside from "../../Hoc/makeCatchoutside";
import {PerformanceStore} from "../../store/PerformanceStore";
import {IPlaylist} from "../../interfaces/interface";
interface IWidhtRouterStyleLinkProps {
    to?: string | Object
    isActive?: (match: any, location: any) => boolean
}

function StyleLinkIsActive(item: IPlaylist) {
    return (match: any, location: any) => {
        if (match) {
            return item.id == location.search.substr(4)
        }
        return false
    }
}

const HeaderPlaylist = ({loginModel}: { loginModel: UserModel }) => {

    return (
        <ul className={styles._aside_header_ul}>
            {
                loginModel.playlists.map((item, i) => {
                    return (
                        <li key={`${item.id}- playlist -` + i}>
                            <StyleLink
                                isActive={StyleLinkIsActive(item)}
                                to={{
                                    pathname: `/playlist`
                                    , search: `?id=${item.id}`
                                }}
                            >
                                <em>🎶</em> {item.title || item.label_name}
                            </StyleLink>
                        </li>)
                })
            }
        </ul>
    )
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

@inject(SESSION_STORE, USER_STORE, TRACK_STORE, PERFORMANCE_STORE)
@observer
@makeCatchoutside
export class Header extends React.Component<IHeaderProp, any> {
    state = {isOpen: false}

    toggleMenusShowing = () => {
        this.setState(prev => ({isOpen: !prev.isOpen}))
    }

    handleTouchOutside = () => {
        this.setState(prev => ({isOpen: false}))
    }

    handleAuthClick = () => {
        const {sessionStore: store} = this.props;
        if (!store.user) {
            store.login()
        } else {
            store.loginout()
        }
    }

    handle2Browser = () => {
        this.props.history.push("/main")
    }
    handleSearch = (value) => {
        const {location, history, trackStore} = this.props
        if (
            location.pathname !== 'main') {
            history.push('/main')
        }
        trackStore.setGenre(`${FETCH_QUERY}_${value}`, function () {
            return `tracks?linked_partitioning=1&limit=20&offset=0&q=${value}`
        })
    }

    renderTop = () => {
        const {performanceStore} = this.props

        const searchStyle = !performanceStore.isUnderLarge ? {
            flexDirection: "column-reverse",
            alignItems: "center"
        } : {}
        const spanImage = performanceStore.windowWidth < 430 ? {
            width: "100%"
        } : {}
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
                <div
                    className={styles._aside_header_search}
                    style={searchStyle}
                >
                    <SearchPanel
                        handleSearch={this.handleSearch}
                    />
                    <span
                        onClick={this.handle2Browser}
                        className={styles.divemusic}
                        style={spanImage}
                    />
                </div>
                <div
                    onClick={this.toggleMenusShowing}
                    className={styles._aside_header_bars}>
                    <em className="fa fa-bars fa-2x"/>
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
                    <span> MY PLAYLIST </span> <em className="fa fa-plus "/>
                </div>
                <HeaderPlaylist loginModel={loginModel}/>
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
                        > <em className="fa fa-star"/> likes
                        </StyleLink>
                    </li>
                    <li>
                        <StyleLink>
                            <em className="fa fa-music"/> Tracks </StyleLink></li>
                    <li>
                        <StyleLink
                            isActive={isActive}
                            to={{
                                pathname: `/users/followings`,
                                search: `?id=${user && user.id}`
                            }}
                        >
                            <em className="fa fa-users"/> Followings
                        </StyleLink></li>
                    <li>
                        <StyleLink
                            isActive={isActive}

                            to={{
                                pathname: `/users/followers`,
                                search: `?id=${user && user.id}`
                            }}
                        > <em className="fa fa-user"/> Followers
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

    componentDidMount() {
        this.props.sessionStore.loadDataFromCookie();
    }

    getLoginUserModel() {
        return this.props.userStore.getLoginUserModel;
    }

    renderBasicItems() {
        const isLogined = this.props.userStore.isLogined
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
                    {isLogined && loginModel ?
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
        const {performanceStore} = this.props
        const isOpen = this.state.isOpen || !performanceStore.isUnderLarge
        return (
            <section className={styles._aside}>
                {this.renderTop()}
                <ObservableMotion
                    isOpen={isOpen}
                    style={{x: isOpen ? spring(0) : spring(-100)}}>
                    {this.renderBasicItems()}
                    {this.renderMyCommuPaner()}
                    {this.renderMyPlaylist()}
                </ObservableMotion>
            </section>
        );
    }
}

// TL;DR Motion作为外部组件,需要observer来包裹
const ObservableMotion = observer(({isOpen, style, children}: any) => {
    const menusStyle = isOpen ? {display: 'block'} : {};
    return (
        <Motion style={style}>
            {
                value => {
                    return (
                        <div
                            onClickCapture={this.toggleMenusShowing}
                            style={{...menusStyle, left: value.x + "%"}}
                            className={styles._menus}
                        >
                            {children}
                        </div>
                    )
                }
            }
        </Motion>
    )
})
export default withRouter(Header)
