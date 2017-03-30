import * as React from 'react'
import TrackProfile from '../TrackProfile'
import { observer, inject } from 'mobx-react'
import { ITrackStore } from '../../store/TrackStore'
import { IPlayerStore } from '../../store/PlayerStore'
import { ITrack, ICommentStore } from "../../store/index";
import { runInAction, observable } from ".3.1.7@mobx/lib/mobx";
import CommentsContainer from '../Comments'
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
  @observable track: ITrack

  componentDidMount() {
    const { location: { search }, TrackStore } = this.props
    if (search) {
      const id = qs.parse(search.substr(1)).id
      runInAction(() => {
        this.track = TrackStore.getTrackFromId(id)
      })
    } else {
    }
    console.log(this.props);
    console.log(search);

  }

  handlePlay = () => {
    const { PlayerStore, TrackStore } = this.props
    if (!PlayerStore || !TrackStore) {
      return;
    }
    PlayerStore.setPlayingTrack(this.track)
    //TODO playintlist
  }

  handleAddToPlaylist = () => {
    const { PlayerStore, TrackStore } = this.props
    if (!PlayerStore || !TrackStore) {
      return;
    }
    //TODO add to playinglist
    PlayerStore.addToPlaylist(this.track)
  }
  handleFetchMoreComments = () => {
    this.props.CommentStore.fetchMoreComments();
  }
  render() {
    if (!this.track) {
      //Todo 
      return <noscript />
    }
    // const { activitiesCount, activities } = this.props.trackStore
    const { label_name
      // , release_day
      , user, artwork_url } = this.track
    // const { username, id, avatar_url } = user;
    const { commentsCount } = this.props.CommentStore
    return (
      <div className={styles.main}>
        <TrackProfile
          bigPic={artwork_url}
          label_name={label_name}
          track={this.track}
          type={'Track'}
          user={user}
        />

        <div className={styles.comments}>
          <div className={styles.commentsCount}>
            Comments : {commentsCount}
          </div>

          <CommentsContainer
            CommentStore={this.props.CommentStore}
            track={this.track}
            scrollFunc={this.handleFetchMoreComments}
          />
        </div>
      </div>

    );
  }
}

export default TracklistinfoView;