import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import UserItemContainer from '../User/User'
import { IUserStore } from '../../store/UserStore'
import { FETCH_FOLLOWERS } from '../../constants/fetchTypes'
import ButtonMore from '../ButtonMore';

export interface IFollowersProps {
  UserStore: IUserStore
}
@observer
class Followers extends React.Component<IFollowersProps, any> {

  handleMoreClick = () => {
    const { fetchFollowers, nextHrefs } = this.props.UserStore;
    const nextHref$ = nextHrefs[FETCH_FOLLOWERS];
    fetchFollowers(nextHref$);
  }
  render() {
    const { followers, isLoadings } = this.props.UserStore
    const isLoading = isLoadings[FETCH_FOLLOWERS] || false;
    console.log(isLoading + "-------")
    return <section>

      {followers.map((follower: IUser) => {
        return <UserItemContainer key={follower.id} user={follower} />
      })}
      <ButtonMore isLoading={isLoading} onClick={this.handleMoreClick} />
    </section>
  }
}

export default Followers;