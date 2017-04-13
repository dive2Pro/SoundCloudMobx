import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { FETCH_PLAYLIST } from '../../constants/fetchTypes'
import TrackProfile from '../TrackProfile'
import HocLoadingMore from '../HocLoadingMore'
import Activities from '../Activities'
import { Link } from 'react-router-dom'
import { IPlaylist, IisLoading } from '../../interfaces/interface';
import ArtWork from '../ArtWork'
import LoadingSpinner from '../LoadingSpinner'
import { UserStore, UserModel } from '../../store/UserStore';
import { USER_STORE, TRACK_STORE, PLAYER_STORE, PERFORMANCE_STORE } from '../../constants/storeTypes';
import { PlayerStore } from '../../store/PlayerStore';
const qs = require('qs')
import Operators from '../Operators'
import { BigUserIcon } from '../Community'
import { PerformanceStore } from '../../store/PerformanceStore';
const styles = require('./playlist.scss')
import makeLoadingSpinner from '../../Hoc/makeLoadingSpiner'


interface IPlaylistProps extends IisLoading {
  playerStore?: PlayerStore
  userModel: UserModel
  match?: any
}

const PlaylistItem = observer(function PlaylistItem({ info }: { info: IPlaylist }) {
  const { artwork_url, label_name, id, title } = info
  const to = { pathname: '/playlist', search: `?id=${id}` }
  return (
    <div className={styles.itemContainer}>
      <Link to={to}>
        <ArtWork src={artwork_url} size={250} />
      </Link>
      <div className={styles.itemTitle}>

        <Link to={to}><h3>{label_name || title}</h3></Link>
      </div>
    </div>
  )
})


@observer
class Playlist extends React.Component<IPlaylistProps, any>{

  componentDidMount() {
    const {
       userModel
    } = this.props
    userModel.fetchWithType(FETCH_PLAYLIST);
  }

  render() {
    const um = this.props.userModel
    const { playlists } = um
    return (
      <div className={styles.playlist}>
        {playlists.map((item, i) => {
          return (
            <PlaylistItem
              info={item}
              key={item.id + '-info-' + i}
            />
          )
        })}
      </div>
    )
  }
}

export default HocLoadingMore<IPlaylistProps, any>(makeLoadingSpinner(Playlist, FETCH_PLAYLIST))

interface IPlaylistInfoProp {
  location: any
  playerStore: PlayerStore
  userStore: UserStore
  performanceStore: PerformanceStore
}

@inject(TRACK_STORE, PLAYER_STORE, USER_STORE, PERFORMANCE_STORE)
@observer
export class PlaylistInfo extends React.PureComponent<IPlaylistInfoProp, any> {
  id = 'playlistView'
  handlePlay = () => {
    const { playerStore } = this.props
    if (!playerStore) {
      return;
    }
  }
  componentDidMount() {
    this.handleLocationChange()
    this.props.performanceStore.setCurrentGlassNodeId(this.id)
  }
  handleAddToPlaylist = () => {
    const { playerStore } = this.props
    if (!playerStore) {
      return;
    }
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
        />
        <div style={{ padding: '20px' }}>
          <Operators
            tracks={tracks}
            isPlaylist={true}
          />
          <div className={styles.playlist_body}>
            <BigUserIcon
              user={user}
              handleFollow={() => { userStore.detectIsFollowing(user.id) }}
              isFollowing={isFollowing}
            />
            <Activities
              isLoading={false}
              scrollFunc={() => { }}
              sortType=""
              isError={false}
              tracks={tracks}
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

