import * as React from 'react'
import TrackProfile from '../TrackProfile'
import { observer, inject } from 'mobx-react'
import { ITrackStore } from '../../store/TrackStore'
import { IPlayerStore } from '../../store/PlayerStore'
import {
  ICommentStore,
  ITrack
} from "../../store/index";
import LoadingSpinner from '../LoadingSpinner'

import CommentsContainer from '../Comments'
import { FETCH_TRACK } from "../../constants/fetchTypes";
const qs = require('qs')
const styles = require('./track.scss');


interface ITracklistinfoViewProps {
  TrackStore: ITrackStore
  PlayerStore: IPlayerStore
  CommentStore: ICommentStore
  match: any
  location: any
}


@inject("TrackStore", 'PlayerStore', "CommentStore")
@observer
class TracklistinfoView extends React.Component<ITracklistinfoViewProps, any> {

  componentDidMount() {
    const { location: { search }, TrackStore } = this.props
    if (search) {
      const id = qs.parse(search.substr(1)).id
      TrackStore.setGenre(FETCH_TRACK)
      TrackStore.setTrackId(id)
    }
  }

  handlePlay = () => {
    const { PlayerStore, TrackStore } = this.props
    if (!PlayerStore || !TrackStore) {
      return;
    }
    PlayerStore.setPlayingTrack(TrackStore.currentTrack)
  }

  handleAddToPlaylist = () => {
    const { PlayerStore, TrackStore } = this.props
    if (!PlayerStore || !TrackStore) {
      return;
    }
    PlayerStore.addToPlaylist(TrackStore.currentTrack)

  }
  handleFetchMoreComments = () => {
    this.props.CommentStore.fetchMoreComments();
  }
  renderContent = (currentTrack: ITrack) => {
    const { label_name
      // , release_day
      , user, artwork_url } = currentTrack
    // const { username, id, avatar_url } = user;
    const { commentsCount } = this.props.CommentStore
    return <div>
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
          CommentStore={this.props.CommentStore}
          track={currentTrack}
          scrollFunc={this.handleFetchMoreComments}
        />
      </div>
    </div>
  }
  render() {
    const { currentTrack, isLoading } = this.props.TrackStore

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