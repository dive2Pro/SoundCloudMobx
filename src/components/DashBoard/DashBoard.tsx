import * as React from 'react'
const styles = require('./dashboard.scss')
import Profile from '../Profile/Profile';
import { observer, inject } from 'mobx-react'
import FilterActivities from '../FilterActivities'
import FollowersPanel from '../FollowersPanel'
import FollowingsPanel from '../FollowingsPanel'
import Favorites from "../FavoritesPanel";
import { Route, Switch, Redirect } from 'react-router-dom'
import CommunityContainer from '../Community'
import * as fetchTypes from '../../constants/fetchTypes'
import Activities from '../Activities'
import Playlist from '../Playlist'
import {
  IActivitiesStore, IPlayerStore, IUserStore
} from "../../store";
import {
  // action
} from ".3.1.7@mobx/lib/mobx";
// import { autorun } from ".3.1.7@mobx/lib/mobx";
import LoadingSpinner from '../LoadingSpinner'
const qs = require('qs')
interface IDashBorardProps {
  UserStore: IUserStore
  ActivitiesStore: IActivitiesStore
  PlayerStore: IPlayerStore
  location?: any
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
@inject("UserStore", "ActivitiesStore", 'PlayerStore')
@observer
class DashBorard extends React.Component<IDashBorardProps, any> {
  id: number

  handlerFetchMoreContacts = (type: string) => {
    this.props.UserStore.userModel.fetchWithType(type);
  }

  componentDidMount() {
    this.props.UserStore.userModel.fetchCommunityData();
  }

  componentWillMount() {
    const loc = this.props.location
    if (loc) {
      //todo id undefined redicet to other 
      const id = +qs.parse(loc.search.substr(1))['id'];
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
      const id = +qs.parse(loc.search.substr(1))['id']
      this.changeUserId(id)
    }
  }
  handleFetchMorePlaylist = () => {

  }
  render() {
    if (this.id == undefined) {
      return <Redirect to="/main" />
    }

    const { userModel, isLoginUser } = this.props.UserStore
    if (!userModel) {
      return <LoadingSpinner isLoading={true} />
    }

    const {
      user
      , followers
      , followings, favorites
    } = userModel;
    const isloadingFollowers = userModel.isLoading(fetchTypes.FETCH_FOLLOWERS)
    const isloadingFollowings = userModel.isLoading(fetchTypes.FETCH_FOLLOWINGS)
    const isloadingFavorites = userModel.isLoading(fetchTypes.FETCH_ACTIVITIES)
    const FavoView = () =>
      <Activities
        sortType={''}
        isLoading={isloadingFavorites}
        scrollFunc={() => userModel.fetchWithType(fetchTypes.FETCH_FAVORITES)}
        tracks={favorites}
      />
    // const { filteredTracks: tracks, isLoading, sortType } = actsStore
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <Switch>
            <Route
              path='/users/followers'
              render={() => {
                return <CommunityContainer
                  isLoading={isloadingFollowers}
                  scrollFunc={() => this.handlerFetchMoreContacts(fetchTypes.FETCH_FOLLOWERS)}
                  users={followers}
                />
              }}
            />

            <Route
              path='/users/followings'
              render={() => {
                return <CommunityContainer
                  isLoading={isloadingFollowings}
                  scrollFunc={() => this.handlerFetchMoreContacts(fetchTypes.FETCH_FOLLOWINGS)}
                  users={followings}
                />
              }}
            />

            <Route
              path='/users/favorites'
              component={FavoView}
            />

            <Route
              path='/users/playlist'
              render={(match: any) => {
                console.log(match)
                return <Playlist
                  scrollFunc={this.handleFetchMorePlaylist}
                  userModel={userModel} />
              }}
            />

            <Route
              path="/"
              render={() => {
                return isLoginUser ?
                  <FilterActivities /> : <FavoView />
              }}
            />


          </Switch>
        </div>
        <aside className={styles.aside}>
          <Profile user={user} />
          <Favorites
            PlayerStore={this.props.PlayerStore}
            UserModel={userModel} />
          <FollowersPanel UserModel={userModel} />
          <FollowingsPanel UserModel={userModel} />
        </aside>
      </div>
    );
  }
}


export default (DashBorard);