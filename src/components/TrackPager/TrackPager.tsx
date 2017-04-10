import * as React from 'react'
import TrackProfile from '../TrackProfile'
import { observer, inject } from 'mobx-react'
import { TrackStore } from '../../store/TrackStore'
import LoadingSpinner from '../LoadingSpinner'

import CommentsContainer from '../Comments'
import { FETCH_TRACK } from '../../constants/fetchTypes';
import { CommentStore } from '../../store/CommentStore';
import { COMMENT_STORE, TRACK_STORE, PLAYER_STORE } from '../../constants/storeTypes'
import { ITrack } from '../../interfaces/interface';
import { PlayerStore } from "../../store/PlayerStore";
const qs = require('qs')
const styles = require('./track.scss');


interface ITracklistinfoViewProps {
  trackStore: TrackStore
  playerStore: PlayerStore
  commentStore: CommentStore
  match: any
  location: any
}


@inject(TRACK_STORE, PLAYER_STORE, COMMENT_STORE)
@observer
class TracklistinfoView extends React.Component<ITracklistinfoViewProps, any> {

  componentDidMount() {
    const { location: { search }, trackStore } = this.props
    if (search) {
      const id = qs.parse(search.substr(1)).id
      trackStore.setGenre(FETCH_TRACK)
      trackStore.setTrackId(id)
    }
  }

  handlePlay = () => {
    const { playerStore, trackStore } = this.props
    if (!playerStore || !trackStore) {
      return;
    }
    playerStore.setPlayingTrack(trackStore.currentTrack)
  }

  handleAddToPlaylist = () => {
    const { playerStore, trackStore } = this.props
    if (!playerStore || !trackStore) {
      return;
    }
    playerStore.addToPlaylist(trackStore.currentTrack)

  }
  handleFetchMoreComments = () => {
    this.props.commentStore.fetchMoreComments();
  }
  renderContent = (currentTrack: ITrack) => {
    const { label_name
      // , release_day
      , user, artwork_url } = currentTrack
    // const { username, id, avatar_url } = user;
    const { commentsCount } = this.props.commentStore
    return (
      <div>
        <TrackProfile
          bigPic={artwork_url}
          label_name={label_name}
          track={currentTrack}
          type={'Track'}
          user={user}
        />

        <div className={styles.comments}>
          <div className={styles.commentsCount}>
            Comments : {commentsCount}
          </div>

          <CommentsContainer
            commentStore={this.props.commentStore}
            track={currentTrack}
            scrollFunc={this.handleFetchMoreComments}
          />
        </div>
      </div>)
  }
  render() {
    const {
       currentTrack,
      isLoading
     } = this.props.trackStore

    return (
      <div className={styles.main}>
        {isLoading || !currentTrack
          ? <LoadingSpinner isLoading={true} />
          : this.renderContent(currentTrack)}
      </div>

    );
  }
}

export default TracklistinfoView;