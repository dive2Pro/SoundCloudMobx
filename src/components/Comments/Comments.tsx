import * as React from 'react'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import { observer, inject } from 'mobx-react'
import LoadingSpinner from '../LoadingSpinner'
import { specTimeTamp } from '../../services/utils'
import ArtWork from '../ArtWork'
import { HomeLink } from '../Links'
import { CommentStore, IComment } from '../../store/CommentStore';
import { TRACK_STORE, PERFORMANCE_STORE } from '../../constants/storeTypes';
import { ITrack } from '../../interfaces/interface';
const styles = require('./comments.scss')


interface ICommentsProps {
  commentStore: CommentStore
  track: ITrack
}

const TYPE_COMMENTS = 'Comments';




const CommentView = ({ comment }: { comment: IComment }) => {
  const { user: { id, avatar_url, username }, body, created_at } = comment;

  return (
    <div className={styles.comment}>
      <ArtWork
        size={75}
        src={avatar_url}
        clazz={styles.avatar}
      />
      <div className={styles.info}>
        <div className={styles.content}>
          <HomeLink
            id={id}
          >
            {username}
          </HomeLink> :
            <p>
            {body}
          </p>
        </div>
        <div className={styles.time}>
          {specTimeTamp(created_at)}
        </div>
      </div>
    </div>
  )
}

@inject(TRACK_STORE, PERFORMANCE_STORE)
@observer
class Comments extends React.Component<ICommentsProps, any> {

  componentDidMount() {

    const { track, commentStore } = this.props
    // const { id } = track
    commentStore.setCurrentTrack(track);
  }

  render() {
    const { currentTrackComments: comments
      , isLoadingMoreComment
    } = this.props.commentStore
    return (
      <div style={{ width: '100%' }}>
        {
          comments.map((item, index) => {
            return <CommentView key={item.id + '-' + index} comment={item} />
          })
        }
        <LoadingSpinner isLoading={isLoadingMoreComment} />
      </div>
    );
  }
}

// todo  Transitions
export default Hoc<ICommentsProps, any>(Comments, TYPE_COMMENTS);