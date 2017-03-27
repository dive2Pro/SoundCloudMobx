import * as React from 'react'
import Hoc from '../HocLoadingMore'
import { observer, inject } from 'mobx-react'
import LoadingSpinner from '../LoadingSpinner'
import { ICommentStore, IComment, ITrack } from "../../store/index";
import ArtWork from '../ArtWork'
const styles = require('./comments.scss')


interface ICommentsProps {
  CommentStore: ICommentStore
  track: ITrack
}


const CommentView = ({ comment }: { comment: IComment }) => {
  const { user: { avatar_url, username }, body, created_at } = comment;

  return (
    <div className={styles.comment}>
      <ArtWork
        size={50} src={avatar_url}
      />
      <div className={styles.info}>
        <div className={styles.content}>
          <a href="#">{username}</a>:\t {body}
        </div>
        <div className={styles.time}>
          {created_at}
        </div>
      </div>
    </div>
  )
}

@inject("TrackStore")
@observer
class Comments extends React.Component<ICommentsProps, any> {

  componentDidMount() {
    const { track, CommentStore } = this.props
    // const { id } = track
    CommentStore.setCurrentTrack(track);
  }

  render() {
    const { currentTrackComments: comments, isLoading } = this.props.CommentStore
    return (
      <div>
        {
          comments.map(item => {
            return <CommentView key={item.id} comment={item} />
          })
        }

        <LoadingSpinner isLoading={isLoading} />
      </div>
    );
  }
}

export default Hoc(Comments);