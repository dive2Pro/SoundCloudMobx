import * as React from 'react'
import TrackProfile from '../TrackProfile'
import { observer, inject } from 'mobx-react'
import { TrackStore } from '../../store/TrackStore'
import LoadingSpinner from '../LoadingSpinner'
import Operators from '../Operators'
import CommentsContainer from '../Comments'
import { FETCH_TRACK } from '../../constants/fetchTypes';
import { CommentStore } from '../../store/CommentStore';
import { COMMENT_STORE, TRACK_STORE, PLAYER_STORE, PERFORMANCE_STORE, USER_STORE } from '../../constants/storeTypes'
import { ITrack } from '../../interfaces/interface';
import { PlayerStore } from '../../store/PlayerStore';
import { PerformanceStore } from '../../store/PerformanceStore';
import { BigUserIcon } from '../Community/index';
import { UserStore } from "../../store/UserStore";
import ArtWork from '../ArtWork'
const qs = require('qs')
const styles = require('./track.scss');


interface ITrackPagerProps {
  trackStore: TrackStore
  playerStore: PlayerStore
  commentStore: CommentStore
  performanceStore: PerformanceStore
  userStore: UserStore
  match: any
  location: any
}


@inject(TRACK_STORE, PLAYER_STORE, COMMENT_STORE, PERFORMANCE_STORE, USER_STORE)
@observer
class TrackPager extends React.Component<ITrackPagerProps, any> {
  id = 'TrackPager'
  trackId: number = -1
  prevTrackGenre: string = ''
  componentDidMount() {
    const { location: { search }, trackStore, performanceStore } = this.props
    performanceStore.setCurrentGlassNodeId(this.id)

    if (search) {
      const id = qs.parse(search.substr(1)).id
      this.trackId = id
      if (trackStore.currentGenre != FETCH_TRACK) {
        this.prevTrackGenre = trackStore.currentGenre
      }
      trackStore.setGenre(FETCH_TRACK)
      trackStore.setTrackId(id)
    }
    // this.currentTrack = trackStore.currentTrack
  }

  componentWillUnmount() {
    const { trackStore } = this.props
    trackStore.setGenre(this.prevTrackGenre)
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

  handleReplay = (e: any) => {
    const replay = e.target.elements.replay
    const msg = replay.value
    replay.value = ""
    e.preventDefault();
    const { commentStore } = this.props
    commentStore.submitReplay(this.trackId, msg);
  }

  renderReplay = () => {
    const { userStore } = this.props
    const um = userStore.getLoginUserModel
    if (!userStore.isLogined || !um) {
      return <noscript />
    }
    const { avatar_url } = um.user
    return (
      <form action="#" onSubmit={this.handleReplay}>
        <div className={styles.replay_div}>
          <ArtWork
            size={50}
            src={avatar_url}
          />
          <div className={styles.replay_input}>
            <input
              placeholder="Write a comment" name="replay"
              type="text" />

          </div>
        </div>
      </form>
    )


  }


  renderContent = (currentTrack: ITrack) => {
    const { label_name
      // , release_day
      , user, artwork_url } = currentTrack
    const ps = this.props.performanceStore
    return (
      <div >
        <TrackProfile
          bigPic={artwork_url}
          label_name={label_name}
          track={currentTrack}
          type={'Track'}
          user={user}
        />
        <div className={styles.comments}>
          <section className={styles.replay_operators}>
            {this.renderReplay()}
            <Operators
              track={currentTrack}
            />
          </section>

          <div className={styles.comment_body}>
            <BigUserIcon
              user={user}
              handleFollow={() => { }}
              isFollowing={false}
            />
            <CommentsContainer
              commentStore={this.props.commentStore}
              track={currentTrack}
              scrollFunc={this.handleFetchMoreComments}
            />
          </div>
        </div>
      </div >)
  }
  render() {
    const {
       currentTrack,
      isLoading
      , isError
     } = this.props.trackStore

    return (
      <div
        id={this.id}
        className={styles.main}>
        {isLoading || !currentTrack
          ? (
            <LoadingSpinner
              isError={isError(FETCH_TRACK)}
              onErrorHandler={() => this.props.trackStore.fetchSingleTrack(this.trackId)}
              isLoading={isLoading}
            />)
          : this.renderContent(currentTrack)}
      </div>

    );
  }
}

export default TrackPager;