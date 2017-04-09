import * as React from 'react'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import LoadingSpinner from '../LoadingSpinner'
import { IUser } from '../../interfaces/interface';
import ArtWork from '../ArtWork'
import ButtonGhost from '../ButtonGhost'
const styles = require('./community.scss')
import { Link, withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import { IUserStore } from '../../store/index';
interface ICommunityProps {
  UserStore?: IUserStore,
  path: string
  scrollFunc?: () => void
}

const BigUserPic = observer(({ user, handleFollow }: {
  user: IUser
  , handleFollow: (id: number) => void
}) => {
  const { isFollowing, username, avatar_url, id } = user;

  const style = {
    borderRadius: '50%',
    padding: '2px',
    border: `1px solid`
  }
  return (
    <div className={styles.bigpic}>

      <Link
        to={{
          pathname: `/users/home`,
          search: `?id=${id}`
        }}
        className={styles.pic}
      >
        <ArtWork
          style={style}
          src={avatar_url}
          size={180}
        />
      </Link>
      {username}
      <div
        className={styles.toggle}
      >
        <ButtonGhost
          onClick={handleFollow}
        >
          {isFollowing ? 'UNFOLLOW' : 'FOLLOW'}
        </ButtonGhost>
      </div>
    </div>
  )
})
export class EmptyView extends React.Component<any, any> {
  render() {
    return <div />
  }
}

@inject('UserStore')
@observer
class Community extends React.Component<ICommunityProps, any> {

  handleFollow = (user: IUser) => {
    // TODO
    // console.log('Todo : toggleFollowing')
    const us = this.props.UserStore
    if (us) {
      us.followUser(user)
    }
  }

  render() {
    const { UserStore: us, path, scrollFunc } = this.props
    if (!us || !path || !scrollFunc) {
      return (<noscript />)
    }

    const { isError } = us.userModel
    const users: IUser[] = us.userModel[path]
    const isLoading = us.userModel.isLoading(path);
    return (
      <div className={styles.main}>
        {
          users.map(user => (
            <BigUserPic
              key={user.id + '_ bigpic'}
              user={user}
              handleFollow={() => this.handleFollow(user)}
            />
          ))
        }
        <LoadingSpinner
          isError={isError(path)}
          onErrorHandler={scrollFunc}
          isLoading={isLoading} />
      </div>
    );
  }
}

export default Hoc<ICommunityProps, any>(withRouter(Community))
