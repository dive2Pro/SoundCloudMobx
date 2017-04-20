import * as React from 'react'

import { USER_STORE, TRACK_STORE, PLAYER_STORE, PERFORMANCE_STORE } from '../../constants/storeTypes';
import Operators from '../Operators'
import { BigUserIcon } from '../Community'
import { observer, inject } from 'mobx-react'

import { PerformanceStore } from '../../store/PerformanceStore';
import { UserStore, UserModel } from '../../store/UserStore';
import { PlayerStore } from '../../store/PlayerStore';

const qs = require('qs')
import TrackProfile from '../TrackProfile'
import Activities from '../Activities'
import LoadingSpinner from '../LoadingSpinner'
import { IPlaylist, IisLoading } from '../../interfaces/interface';
const styles = require('./playlist.scss')

interface IPlaylistInfoProp {
  location: any
  playerStore: PlayerStore
  userStore: UserStore
  performanceStore: PerformanceStore
}

@inject(TRACK_STORE, PLAYER_STORE, USER_STORE, PERFORMANCE_STORE)
@observer
export default class PlaylistInfo extends React.PureComponent<IPlaylistInfoProp, any> {
  id = 'playlistView'
  handlePlay = () => {
    const { playerStore } = this.props

  }
  componentDidMount() {
    this.handleLocationChange()
    this.props.performanceStore.setCurrentGlassNodeId(this.id)
  }
  handleAddToPlaylist = () => {
    const { playerStore } = this.props

  }
  handleLocationChange = () => {
    const {
      userStore, location: { search }
    } = this.props
    const id = qs.parse(search.substr(1)).id
    const playlist = userStore.fetchedPlaylist;
    if (!playlist || playlist.id != id) {
      userStore.fetchPlaylistData(id);
    }
  }
  componentDidUpdate() {
    this.handleLocationChange()
  }

  handleFollowing = () => {

  }

  renderContent = (playlist: IPlaylist) => {
    const { userStore } = this.props
    const { label_name, title, artwork_url, user, tracks } = playlist
    const isFollowing = userStore.isFollowingUser(user.id)
    return (
      <div className={styles.playlistmain}>
        <TrackProfile
          label_name={title || label_name}
          type="list"
          bigPic={artwork_url}
          user={user}
          playlist={playlist}
          playerStore={this.props.playerStore}
        />
        <div style={{ padding: '20px' }}>
          <Operators
            tracks={tracks}
            isPlaylist={true}
          />
          <div
            className={styles.playlist_body}>
            <BigUserIcon
              user={user}
              handleFollow={() => { userStore.detectIsFollowing(user.id) }}
              isFollowing={isFollowing}
            />
            <Activities
              isLoading={false}
              scrollFunc={() => { }}
              type=""
              isError={false}
              datas={tracks}
            />
          </div>
        </div>
      </div>
    )
  }
  render() {
    const {
      userStore, location: { search }
    } = this.props
    const id = qs.parse(search.substr(1)).id

    const isLoading = (!userStore.fetchedPlaylist
      || userStore.fetchedPlaylist.id != id)
    const playlist = userStore.fetchedPlaylist;
    return (
      <div
        id={this.id}
        className={styles.playlistInfo}>
        {(isLoading || !playlist) ? (<LoadingSpinner isLoading={isLoading} />
        ) : this.renderContent(playlist)}
      </div>
    );
  }
}