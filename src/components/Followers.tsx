import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../interfaces/interface'
export interface IFollowersProps {
  followers: IUser[];
  isLoading: boolean;
}

interface ILoadingSpinner{
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }:ILoadingSpinner) => {
  return <div>
    {isLoading?"Loading...":""}
  </div>
}
const TrackItem = (user: IUser) => {
  return (
    <div>
      {user.full_name}
    </div>
  )
}


@observer
class Followers extends React.Component<IFollowersProps, any> {

  render() {
    const { followers,isLoading } = this.props
    return followers ? 
      <div>
        {followers.map((follower: IUser) => {
          return <TrackItem key={follower.id} {...follower} />
        })}
      </div>
      : <LoadingSpinner isLoading={isLoading}/>
  }
}

export default Followers;