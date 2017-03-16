import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../interfaces/interface'
export interface IFollowersProps {
  followers: IUser[];

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
    const { followers } = this.props
    return followers ? 
      <div>
        {followers.map((follower: IUser) => {
          return <TrackItem {...follower} />
        })}
      </div>
    :   <div>Loading...</div>
  }
}

export default Followers;