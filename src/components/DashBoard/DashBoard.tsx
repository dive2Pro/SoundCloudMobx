import * as React from 'react'
const styles = require('./dashboard.scss')
import Profile from '../Profile/Profile';
import { observer, inject } from 'mobx-react'
import FilterActivities from '../FilterActivities'
import FollowsPanel, { FollowType } from '../FollowsPanel'
import Favorites from '../FavoritesPanel';
import { Route, Switch, Redirect } from 'react-router-dom'
import CommunityContainer from '../Community'
import * as fetchTypes from '../../constants/fetchTypes'
import Activities from '../Activities'
import Playlist from '../Playlist'
import ArtWork from '../ArtWork'
// import { findRootParentOffSet as findRootParentOffSet$ } from '../../services/utils'

import {
  IActivitiesStore, IPlayerStore, IUserStore, IPerformanceStore
} from '../../store';
import LoadingSpinner from '../LoadingSpinner'
import { getSpecPicPath, PicSize } from '../../services/soundcloundApi'
import Blur from 'react-blur'
// import StreamContainer from "../Stream";
// import { IUser } from '../../interfaces/interface'
const qs = require('qs')

interface IDashBorardProps {
  UserStore: IUserStore
  ActivitiesStore: IActivitiesStore
  PerformanceStore: IPerformanceStore
  PlayerStore: IPlayerStore
  location?: any
  match: any
}

export const BlankView = () => {
  return (
    <div>
      You dont have the permission,Need login;
    </div>
  )
}
/**
 * 用户界面
 */
@inject('UserStore', 'ActivitiesStore', 'PlayerStore', 'PerformanceStore')
@observer
class DashBorard extends React.Component<IDashBorardProps, any> {
  headerInfo: any;
  handlePlayAll: any;
  handleFollow: any;
  headerImg: any;
  profile: any;
  id: number
  glassStyle: any = {}
  infoGlassStyle: any = {}
  handlerFetchMoreContacts = (type: string) => {
    this.props.UserStore.userModel.fetchWithType(type);
  }

  componentDidMount() {
    this.props.UserStore.userModel.fetchCommunityData();
    this.props.PerformanceStore.setCurrentGlassNodeId('DashBoard')
    const p = this.profile
    const hi = this.headerInfo
    this.glassStyle = {
      // TODO 这里如果修改父组件的display为 block,则需要修改为40
      // why?
      left: -(p.offsetLeft) + 'px'
      , top: -p.offsetTop + 'px'
      , height: '300px'
      , width: this.headerImg.offsetWidth + 'px'
      , position: 'absolute'
      , zIndex: '-1'
      , display: 'inline-flex'
    },
      this.infoGlassStyle = {
        left: -hi.offsetLeft + 'px'
        // , top: -hi.offsetTop + 'px'// todo
        , top: '-140px'
        , height: hi.offsetHeight + 'px'
        , width: this.headerImg.offsetWidth + 'px'
        , position: 'absolute'
        , zIndex: '-1'
      }
    // console.log(this.infoGlassStyle, hi.offsetTop)
    this.forceUpdate()
  }

  componentWillMount() {
    const loc = this.props.location
    if (loc) {
      //todo id undefined redicet to other 
      const id = +qs.parse(loc.search.substr(1)).id
      this.changeUserId(id)
    }
  }

  changeUserId(id: number) {
    this.id = id;
    const us = this.props.UserStore
    const userModel = us.initUser(this.id)
    userModel.fetchCommunityData();
    us.setCurrentUserModel(userModel)
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

  FavoView = () => {
    const { userModel } = this.props.UserStore
    const { favorites } = userModel
    const isloadingFavorites = userModel.isLoading(fetchTypes.FETCH_ACTIVITIES);
    return () => (
      <div >
        <p className={styles._songs_tag}>FAVORITES SONGS</p>
        <Activities
          sortType={''}
          isLoading={isloadingFavorites}
          scrollFunc={() => userModel.fetchWithType(fetchTypes.FETCH_FAVORITES)}
          tracks={favorites}
        />
      </div>
    )
  }
  render() {
    if (Number.isNaN(this.id) || this.id == undefined) {
      return <Redirect to="/main" />
    }

    const { userModel, isLoginUser } = this.props.UserStore
    if (!userModel) {
      return <LoadingSpinner isLoading={true} />
    }

    const {
       followers
      , followings
    } = userModel;
    const user: any = userModel.user;

    const isloadingFollowers = userModel.isLoading(fetchTypes.FETCH_FOLLOWERS)
    const isloadingFollowings = userModel.isLoading(fetchTypes.FETCH_FOLLOWINGS)
    const { match: { url } } = this.props
    const FV = this.FavoView()
    const avatar_url = user.avatar_url
    let backgroundImageUrl = 'preImage'
    if (Object.keys(this.glassStyle).length > 0) {
      backgroundImageUrl = avatar_url && getSpecPicPath(avatar_url, PicSize.MASTER);
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
      // , justifyContent: 'center'
      // , width: '180px'
    }
    return (
      <div
        id="DashBoard"
        className={styles.container}>
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
            <h3 className={styles._contentHeader_genre}>Hip Hop</h3>
            <span
              style={{
                fontSize: '36px', color: 'white'
                , fontWeight: 600
              }}
            >
              {user.username}
            </span>
            <div className={styles._contentHeader_actions}>
              <button onClick={this.handlePlayAll}>PLAY</button>
              <button onClick={this.handleFollow}>{user.isFollowing ? 'UNFOLLOW' : 'FOLLOW'}</button>
            </div>

            <Blur
              img={backgroundImageUrl}
              blurRadius={5}
              style={this.infoGlassStyle}
            />

          </div>
          <div
            ref={n => this.profile = n}
            style={profile$}
            className={styles._contentHeader_profile}
          >

            <ArtWork
              size={50}
              src={avatar_url}
              alt="user Profile" />
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

          </div>
        </div>
        <div className={styles._contentBody}>

          <div className={styles._contentBody_main}>
            <Switch>
              <Route
                path={`${url}/followers`}
                render={() => {
                  return (
                    <CommunityContainer
                      isLoading={isloadingFollowers}
                      scrollFunc={() =>
                        this.handlerFetchMoreContacts(fetchTypes.FETCH_FOLLOWERS)}
                      users={followers}
                    />
                  )
                }}
              />
              <Route
                path={`${url}/followings`}
                render={() => {
                  return (
                    <CommunityContainer
                      isLoading={isloadingFollowings}
                      scrollFunc={() =>
                        this.handlerFetchMoreContacts(fetchTypes.FETCH_FOLLOWINGS)}
                      users={followings}
                    />
                  )
                }}
              />
              <Route
                path={`${url}/favorites`}
                component={FV}
              />
              <Route
                path={`${url}/playlist`}
                render={(match: any) => {
                  return (
                    <Playlist
                      scrollFunc={this.handleFetchMorePlaylist}
                      userModel={userModel}
                    />
                  )
                }}
              />
              <Route
                path="/"
                render={() => {
                  return isLoginUser ?
                    <FilterActivities />
                    : <FV />
                }}
              />
              {/*<StreamContainer userModel={userModel} />*/}
            </Switch>
          </div>
          <aside className={styles._contentBody_community}>
            <Profile user={userModel.user} />

            <Favorites
              PlayerStore={this.props.PlayerStore}
              UserModel={userModel}
            />
            <FollowsPanel
              type={FollowType.FOLLOWERS}
              UserModel={userModel}
            />
            <FollowsPanel
              type={FollowType.FOLLOWINGS}
              UserModel={userModel}
            />
          </aside>
        </div>
      </div>
    );
  }
}

export default DashBorard;