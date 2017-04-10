import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { FETCH_PLAYLIST } from '../../constants/fetchTypes'
import TrackProfile from '../TrackProfile'
import HocLoadingMore from '../HocLoadingMore'
import Activities from '../Activities'
import { Link } from 'react-router-dom'
import { IPlaylist } from '../../interfaces/interface';
import ArtWork from '../ArtWork'
import LoadingSpinner from '../LoadingSpinner'
import { UserStore, UserModel } from '../../store/UserStore';
import { USER_STORE, TRACK_STORE, PLAYER_STORE } from '../../constants/storeTypes';
import { PlayerStore } from "../../store/PlayerStore";
const qs = require('qs')

const styles = require('./playlist.scss')


interface IPlaylistProps {
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
    const isloading = um.isLoading(FETCH_PLAYLIST)
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
        <LoadingSpinner isLoading={isloading} />
      </div>
    )
  }
}

export default HocLoadingMore<IPlaylistProps, any>(Playlist)

interface IPlaylistInfoProp {
  location: any
  playerStore: PlayerStore
  userStore: UserStore
}

@inject(TRACK_STORE, PLAYER_STORE, USER_STORE)
@observer
export class PlaylistInfo extends React.PureComponent<IPlaylistInfoProp, any> {

  handlePlay = () => {
    const { playerStore } = this.props
    if (!playerStore) {
      return;
    }
  }
  componentDidMount() {
    this.handleLocationChange()

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

  render() {
    const {
      userStore, location: { search }
    } = this.props
    const id = qs.parse(search.substr(1)).id
    if (!userStore.fetchedPlaylist || userStore.fetchedPlaylist.id != id) {
      return <LoadingSpinner isLoading={true} />
    }

    const playlist = userStore.fetchedPlaylist;

    const { label_name, artwork_url, user, tracks } = playlist
    return (
      <div

        className={styles.playlistInfo}>
        <TrackProfile
          label_name={label_name}
          type="list"
          bigPic={artwork_url}
          user={user}
          playlist={playlist}
        />

        <Activities
          isLoading={false}
          scrollFunc={() => { }}
          sortType=""
          isError={false}
          tracks={tracks}
        />
      </div>
    );
  }
}

