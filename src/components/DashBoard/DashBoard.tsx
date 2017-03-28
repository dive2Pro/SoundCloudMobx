import * as React from 'react'
const styles = require('./dashboard.scss')
import Profile from '../Profile/Profile';
import { observer, inject } from 'mobx-react'
import { IUserStore } from '../../store/UserStore'
import FilterActivities from '../FilterActivities'
import FollowersPanel from '../FollowersPanel'
import FollowingsPanel from '../FollowingsPanel'
import Favorites from "../FavoritesPanel";
import { Route, Switch } from 'react-router-dom'
import CommunityContainer from '../Community'
import { IActivitiesStore, IPlayerStore } from "../../store";
interface IDashBorardProps {
  UserStore: IUserStore
  ActivitiesStore: IActivitiesStore
  PlayerStore: IPlayerStore
}

export const BlankView = () => {
  return (
    <div>
      You dont have the permission,Need login;
    </div>
  )
}
@inject("UserStore", "ActivitiesStore", 'PlayerStore')
@observer
class DashBorard extends React.Component<IDashBorardProps, any> {

  handlerFetchMoreContacts = () => {

  }

  componentDidMount() {
  }


  render() {
    const userStore = this.props.UserStore;
    const { user
      , followers
      , followings } = userStore;

    // const { filteredTracks: tracks, isLoading, sortType } = actsStore
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <Switch>

            <Route
              path='/users/followers'
              render={() => {
                return <CommunityContainer isLoading={false}
                  scrollFunc={() => this.handlerFetchMoreContacts}
                  users={followers}
                />
              }}
            />
            <Route
              path='/users/followings'
              render={() => {
                return <CommunityContainer isLoading={false}
                  scrollFunc={() => this.handlerFetchMoreContacts}
                  users={followings}
                />
              }}
            />
            <Route
              path="/"
              component={FilterActivities} />
            {/*component={CommunityContainer}*/}
          </Switch>
        </div>
        <aside className={styles.aside}>
          <Profile user={user} />
          <Favorites
            PlayerStore={this.props.PlayerStore}
            UserStore={userStore} />
          <FollowersPanel UserStore={userStore} />
          <FollowingsPanel UserStore={userStore} />
        </aside>
      </div>
    );
  }
}


export default (DashBorard);