import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import UserItemContainer from '../User'
import {
  // IUserStore,
  IUserModel
} from '../../store'
import { FETCH_FOLLOWERS } from '../../constants/fetchTypes'
// import ButtonMore from '../ButtonMore';
import LoadingSpinner from '../LoadingSpinner'
import ViewAll from '../ViewAll';
const styles = require('./followers.scss')
// import {Link} from 'react-router-dom'
import * as CSSModule from 'react-css-modules'
export interface IFollowersProps {
  UserModel: IUserModel

  history?: any
}
@observer
@CSSModule(styles)
class Followers extends React.Component<IFollowersProps, any> {

  handleMoreClick = () => {
    // const userStore = this.props.UserStore
    // const { nextHrefs } = userStore;
    // const nextHref$ = nextHrefs[FETCH_FOLLOWERS];
    // userStore.fetchFollowers(nextHref$);
  }
  render() {
    const um = this.props.UserModel
    const { followers, user } = um

    const isLoading = um.isLoading(FETCH_FOLLOWERS);
    const obj = {
      count: user && user.followers_count,
      clazz: "fa fa-users",
      typeContent: 'follwers',
      path: 'followers',
      id: user && user.id
    }
    //todo turn in to mobx
    const limitFollowers = followers.slice(0, 3);
    // console.table(followers)
    return <section styleName='base'>
      <div styleName="top">
        <ViewAll {...obj} />
      </div>
      <div styleName="main">
        {limitFollowers.map((follower: IUser) => {
          return <UserItemContainer key={follower.id + "panel"} user={follower} />
        })}
        {/*<ButtonMore isLoading={isLoading} onClick={this.handleMoreClick} />*/}
        <LoadingSpinner isLoading={isLoading} />
      </div>
    </section>
  }
}

export default Followers;