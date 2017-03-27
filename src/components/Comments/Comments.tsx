import * as React from 'react'
import Hoc from '../HocLoadingMore'
import { observer, inject } from 'mobx-react'
import LoadingSpinner from '../LoadingSpinner'
import { ICommentStore, IComment, ITrack } from "../../store/index";
// const styles = require('./.scss')


interface ICommentsProps {
  CommentStore: ICommentStore
  track: ITrack
}


const CommentView = ({ comment }: { comment: IComment }) => {
  return (
    <div>
      {comment.body}
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