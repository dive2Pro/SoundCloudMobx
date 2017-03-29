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

import { IActivitiesStore, IPlayerStore, IUserStore, IUserModel } from "../../store";
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
  userModel: IUserModel
  handlerFetchMoreContacts = (type: string) => {

    this.userModel.fetchWithType(type);

  }

  componentDidMount() {
    console.log(this.props)
    this.userModel.fetchCommunityData();
  }
  componentWillMount() {

    const loc = this.props.location
    if (loc) {
      //todo id undefined redicet to other 
      this.id = +qs.parse(loc.search.substr(1))['id'];
    }
  }

  render() {
    const userStore = this.props.UserStore;
    if (this.id == undefined) {
      return <Redirect to="/main" />
    }
    const userModel = userStore.initUserById(this.id)
    this.userModel = userModel
    const { user
      , followers
      , followings, isLoadings
    } = userModel;
    const isloadingFollowers = isLoadings.get(fetchTypes.FETCH_FOLLOWERS) || false
    const isloadingFollowings = isLoadings.get(fetchTypes.FETCH_FOLLOWINGS) || false
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
              path="/"
              component={FilterActivities} />
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