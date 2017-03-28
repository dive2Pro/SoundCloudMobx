import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import UserItemContainer from '../User'
import { IUserStore } from '../../store/UserStore'
import { FETCH_FOLLOWERS } from '../../constants/fetchTypes'
import ButtonMore from '../ButtonMore';
import ViewAll from '../ViewAll';
const styles = require('./followers.scss')
// import {Link} from 'react-router-dom'
import * as CSSModule from 'react-css-modules'
export interface IFollowersProps {
  UserStore: IUserStore
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
    const { followers, isLoadings, user } = this.props.UserStore
    const isLoading = isLoadings[FETCH_FOLLOWERS] || false;
    const obj = {
      count: user && user.followers_count,
      clazz: "fa fa-users",
      typeContent: 'follwers',
      path: 'followers'
    }
    return <section styleName='base'>
      <div styleName="top">
        <ViewAll {...obj} />
      </div>
      <div styleName="main">
        {followers.map((follower: IUser) => {
          return <UserItemContainer key={follower.id} user={follower} />
        })}
        <ButtonMore isLoading={isLoading} onClick={this.handleMoreClick} />
      </div>
    </section>
  }
}

export default Followers;