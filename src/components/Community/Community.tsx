import * as React from 'react'
import Hoc from '../HocLoadingMore'
import LoadingSpinner from '../LoadingSpinner'
import { IUser } from "../../interfaces/interface";
import ArtWork from '../ArtWork'
import ButtonGhost from '../ButtonGhost'
const styles = require('./community.scss')
import { Link } from 'react-router-dom'
interface ICommunityProps {
  users: IUser[]
  isLoading: boolean
}



const BigUserPic = ({ user, handleFollow }: {
  user: IUser
  , handleFollow: (id: number) => void
}) => {
  const { username, avatar_url, id } = user;
  const style = {
    borderRadius: '50%',
    padding: '2px',
    border: `1px solid`
  }
  return (
    <div className={styles.bigpic}>

      <Link to={`user/${id}`} className={styles.pic} >
        <ArtWork
          style={style}
          src={avatar_url} size={180} />
      </Link>
      {username}

      <div
        className={styles.toggle}
      >
        <ButtonGhost
          onClick={handleFollow}>
          Follow
      </ButtonGhost>
      </div>
    </div>
  )
}
export class EmptyView extends React.Component<any, any> {
  render() {
    return <div />
  }
}

class Community extends React.Component<ICommunityProps, any> {

  handleFollow = (user: IUser) => {
    //TODO
    console.log('Todo : toggleFollowing')
  }

  render() {
    const { users
      , isLoading
    } = this.props

    return (
      <div className={styles.main}>
        {
          users.map(user => {
            return <BigUserPic
              key={user.id} user={user} handleFollow={() => this.handleFollow(user)} />
          })
        }
        <LoadingSpinner isLoading={isLoading} />
      </div>
    );
  }
}

export default Hoc(Community);