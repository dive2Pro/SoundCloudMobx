import * as React from 'react'
const styles = require('./dashboard.scss')
import Profile from '../Profile/Profile';
import { observer, inject } from 'mobx-react'
import FilterActivities from '../FilterActivities'
import FollowsPanel from '../FollowsPanel'
import FavoritesPanel from '../FavoritesPanel';
import { Route, Switch } from 'react-router-dom'
import CommunityContainer from '../Community'
import * as fetchTypes from '../../constants/fetchTypes'
import Activities from '../Activities'
import Playlist from '../Playlist'
import LoadingSpinner from '../LoadingSpinner'
import { getSpecPicPath, PicSize } from '../../services/soundcloundApi'
import Blur from 'react-blur'
import { UserStore, User, UserModel } from '../../store/UserStore';
import { USER_STORE, PLAYER_STORE, PERFORMANCE_STORE } from '../../constants/storeTypes';
import { PlayerStore } from '../../store/PlayerStore';
import { PerformanceStore } from '../../store/PerformanceStore';
import { isObservable } from '._mobx@3.1.8@mobx/lib/mobx';
const preload = require('../../../public/images/preload.jpg')
const qs = require('qs')

interface IDashBorardProps {
  userStore: UserStore
  performanceStore: PerformanceStore
  playerStore: PlayerStore
  location?: any
  match: any
  history: any
}

export const BlankView = () => {
  return (
    <div>
      You dont have the permission,Need login;
    </div>
  )
}

const profile$: any = {
  position: 'absolute',
  right: '5%',
  top: '5%',
  zIndex: '2',
  background: 'hsla(0, 0, 100 % ,0.3)',
  overflow: 'hidden',
  display: 'inline-flex'
  , alignItems: 'center'
}


const FavoView = observer((props: any) => {
  const { performanceStore, userStore } = props
  const { userModel } = userStore
  const { favorites, isError } = userModel
  const isloadingFavorites = performanceStore.getLoadingState(fetchTypes.FETCH_FAVORITES);
  return (
    <div >
      <p className={styles._songs_tag}>FAVORITES SONGS</p>
      <Activities
        sortType={''}
        isError={isError(fetchTypes.FETCH_FAVORITES)}
        isLoading={isloadingFavorites}
        scrollFunc={() => userModel.fetchWithType(fetchTypes.FETCH_FAVORITES)}
        tracks={favorites}
      />
    </div>
  )
}
)
/**
 * 用户界面
 */
@inject(
  USER_STORE
  , PLAYER_STORE
  , PERFORMANCE_STORE)
@observer
class DashBorard extends React.Component<IDashBorardProps, any> {
  renderContentBodyMain = (us: UserStore, performanceStore: PerformanceStore) => {
    const { match: { url } } = this.props
    const { userModel } = us
    return (
      <div className={styles._contentBody_main}>
        <Switch>
          {this.renderCommunityContainer(url, fetchTypes.FETCH_FOLLOWERS)}
          {this.renderCommunityContainer(url, fetchTypes.FETCH_FOLLOWINGS)}
          <Route
            path={`${url}/favorites`}
            render={() => {
              return (
                <FavoView
                  userStore={us}
                  performanceStore={performanceStore}
                />)
            }}
          />
          <Route
            path={`${url}/playlist`}
            render={(match: any) => {

              return userModel ? (
                <Playlist
                  scrollFunc={this.handleFetchMorePlaylist}
                  userModel={userModel}
                />
              ) : <LoadingSpinner isLoading={true} />
            }}
          />
          <Route
            path={`/`}
            render={() => {
              console.log('I m still here')
              return us.isLoginUser ?
                <FilterActivities />
                : (
                  <FavoView
                    userStore={us}
                    performanceStore={performanceStore}
                  />)
            }}
          />
        </Switch>
      </div>
    )
  }
  renderContentHeader = (user: User, isLoginUser: boolean) => {
    // const user = model.user;
    const avatar_url = user.avatar_url
    const is = isObservable(avatar_url)
    let backgroundImageUrl = preload
    if (Object.keys(this.infoGlassStyle).length > 0) {
      backgroundImageUrl = avatar_url ?
        getSpecPicPath(avatar_url, PicSize.MASTER) : backgroundImageUrl;
    }


    return (
      <div className={styles._contentHeader}>
        <div
          ref={n => this.headerImg = n}
          className={styles._contentHeader_img}
          style={{
            backgroundImage: `url(${backgroundImageUrl})`
            , width: '1248px', height: '300px'
          }}
        />
        <div
          ref={n => this.headerInfo = n}
          className={styles._contentHeader_info}>
          <span
            onClick={this.handleRouteToUserMain}
            style={{
              fontSize: '36px', color: 'white'
              , fontWeight: 600
              , cursor: 'pointer'
            }}
          >
            {user.username}
          </span>
          <div className={styles._contentHeader_actions}>
            <button onClick={this.handlePlayAll}>PLAY</button>
            {
              isLoginUser ?
                ''
                : (
                  <button
                    onClick={this.handleFollow}
                  >
                    {user.isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
                  </button>
                )
            }
          </div>
          <Blur
            img={backgroundImageUrl}
            blurRadius={5}
            style={this.infoGlassStyle}
          />

        </div>
        {/*<div
          ref={n => this.profile = n}
          style={profile$}
          className={styles._contentHeader_profile}
        >

          <ArtWork
            size={50}
            src={avatar_url}
            alt="user Profile"
          />
          <span>{user.username}</span>
          <span>
            <i
              className="fa fa-angle-down"
            />
          </span>
          <Blur
            img={backgroundImageUrl}
            blurRadius={10}
            style={this.glassStyle}
          />
        </div>*/}
      </div>
    )
  }

  headerInfo: any;
  handlePlayAll: any;

  headerImg: any;
  profile: any;
  id: number
  infoGlassStyle: any = {}
  handlerFetchMoreContacts = (type: string) => {
    const um = this.props.userStore.userModel
    um && um.fetchWithType(type);
  }

  renderCommunityContainer = (url: string, path: string) => {
    return (
      <Route
        path={`${url}/${path}`}
        render={() => {
          {/*const commuUrl = url.substr(url.lastIndexOf('/') + 1)*/ }
          return (
            <CommunityContainer
              path={path}
              scrollFunc={() =>
                this.handlerFetchMoreContacts(path)}
            />
          )
        }}
      />

    )
  }

  handleFollow = () => {
    const { userStore: us } = this.props
    if (us.userModel)
    { us.debouncedRequestFollowUser(us.userModel.user) }
  }

  componentDidMount() {
    this.props.performanceStore.setCurrentGlassNodeId('DashBoard')
    const p = this.profile
    const hi = this.headerInfo

    this.infoGlassStyle = {
      left: -hi.offsetLeft + 'px'
      // , top: -hi.offsetTop + 'px'// todo
      , top: '-140px'
      , height: hi.offsetHeight + 'px'
      , width: this.headerImg.offsetWidth + 'px'
      , position: 'absolute'
      , zIndex: '-9'
    }
    console.log(this.infoGlassStyle.width)
    this.forceUpdate()
  }

  componentWillMount() {
    const loc = this.props.location
    if (loc) {
      // todo id undefined redicet to other 
      const id = +qs.parse(loc.search.substr(1)).id
      this.changeUserId(id)
    }
  }

  changeUserId(id: number) {
    this.id = id;
    const us = this.props.userStore
    const userModel = us.initUser(this.id)
    us.setCurrentUserModel(userModel)
  }

  handleRouteToUserMain = () => {
    const { history } = this.props
    history.push(`/users/home?id=${this.id}`);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const loc = this.props.location;
    if (loc.search !== prevProps.location.search) {
      const id = +qs.parse(loc.search.substr(1)).id
      this.changeUserId(id)
    }
  }
  handleFetchMorePlaylist = () => {

  }


  render() {
    if (Number.isNaN(this.id) || this.id == null) {
      // return <Redirect to="/main" />
    }
    const { userStore: us, performanceStore } = this.props
    const { userModel } = us
    if (!userModel || !userModel.user) {
      return <LoadingSpinner isLoading={true} />
    }

    return (
      <div
        id="DashBoard"
        className={styles.container}
      >
        {this.renderContentHeader(userModel.user, us.isLoginUser)}
        <div className={styles._contentBody}>
          {this.renderContentBodyMain(us, performanceStore)}
          <aside className={styles._contentBody_community}>
            <Profile
              user={userModel.user}
            />
            <FavoritesPanel
              playerStore={this.props.playerStore}
              UserModel={userModel}
            />
            <FollowsPanel
              type={fetchTypes.FETCH_FOLLOWERS}
            />
            <FollowsPanel
              type={fetchTypes.FETCH_FOLLOWINGS}
            />
          </aside>
        </div>
      </div>
    );
  }
}

export default DashBorard;