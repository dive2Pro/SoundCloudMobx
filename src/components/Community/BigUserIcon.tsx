import * as React from 'react'
import { observer } from 'mobx-react'
const styles = require('./community.scss')
import { Link } from 'react-router-dom'
import ArtWork from '../ArtWork'
import { IMiniUser } from '../../interfaces/interface';
import ButtonGhost from '../ButtonGhost';

interface IBigUserPicProps {
  user: IMiniUser
  , handleFollow: (id: number) => void
  , isFollowing: boolean
}

@observer
export default class BigUserPic extends React.PureComponent<IBigUserPicProps, {}> {
  render() {
    const { user, handleFollow, isFollowing } = this.props
    const { username, avatar_url, id } = user;
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
      </div >
    )
  }
}