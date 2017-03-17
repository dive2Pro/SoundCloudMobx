import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner'
import UserItemContainer from '../User/User'
import { IUserStore } from '../../store/UserStore'
import { FETCH_FOLLOWERS } from '../../constants/fetchTypes'

export interface IFollowersProps {
  UserStore: IUserStore
}
@observer
class Followers extends React.Component<IFollowersProps, any> {

  render() {
    const { followers, isLoadings } = this.props.UserStore
    const isLoading = isLoadings[FETCH_FOLLOWERS];

    return followers ?
      <div>
        {followers.map((follower: IUser) => {
          return <UserItemContainer key={follower.id} user={follower} />
        })}
      </div>
      : <LoadingSpinner isLoading={isLoading} />
  }
}

export default Followers;