import * as React from 'react'
import { observer } from 'mobx-react'
const styles = require('./community.scss')
import { Link } from 'react-router-dom'
import ArtWork from '../ArtWork'
import { IMiniUser } from '../../interfaces/interface';
import ButtonGhost from '../ButtonGhost';
import {PerformanceStore} from "../../store/PerformanceStore";


interface IBigUserPicProps {
  user: IMiniUser
  , handleFollow: (id: number) => void
  , isFollowing: boolean
  , performanceStore?: PerformanceStore
}

@observer
export default class BigUserPic extends React.PureComponent<IBigUserPicProps, {}> {
  render() {
    const { user, handleFollow, isFollowing,performanceStore } = this.props
    const { username, avatar_url, id } = user;
    const style = {
      borderRadius: '50%',
      padding: '2px',
      border: `1px solid`
    }
    const artworksize = performanceStore
        ?performanceStore.getSizeWithSpecWidth(180,180,140,100):180
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
            size={artworksize}
          />
        </Link>
        <span className={styles.username}>

          {username}
        </span>

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