import * as React from 'react'
import { observer, inject } from 'mobx-react'
import { ITrackStore, IPlayerStore } from '../../store'
import { FETCH_PLAYLIST } from '../../constants/fetchTypes'
import {
  // ITrack,
  IUserModel,
  IUserStore
} from "../../store/index";
// import { runInAction, observable } from ".3.1.7@mobx/lib/mobx";
import TrackProfile from '../TrackProfile'
import HocLoadingMore from '../HocLoadingMore'
import Activities from '../Activities'
import { Link } from 'react-router-dom'
import { IPlaylist } from "../../interfaces/interface";
import ArtWork from '../ArtWork'
import LoadingSpinner from '../LoadingSpinner'
// import { observable } from ".3.1.7@mobx/lib/mobx";
const qs = require('qs')

const styles = require('./playlist.scss')


interface IPlaylistProps {
  TrackStore?: ITrackStore
  PlayerStore?: IPlayerStore
  userModel: IUserModel
  match?: any
}

const PlaylistItem = observer(({ info }: { info: IPlaylist }) => {
  const { artwork_url, label_name, id } = info
  const to = { pathname: "/playlist", search: `?id=${id}` }
  return (
    <div>
      <Link to={to}>
        <ArtWork src={artwork_url} size={250} />
      </Link>
      <div>
        <Link to={to}><h3>{label_name}</h3></Link>
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
    const { playlists, isLoadings } = this.props.userModel
    const isloading = isLoadings.get(FETCH_PLAYLIST) || true;
    return (
      <div className={styles.playlist}>
        {playlists.map((item, i) => {
          return (
            <PlaylistItem
              info={item}
              key={item.id + "-info-" + i}
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
  // userModel: IUserModel
  location: any
  PlayerStore: IPlayerStore
  UserStore: IUserStore
}
@inject("TrackStore", 'PlayerStore', 'UserStore')
@observer
export class PlaylistInfo extends React.Component<IPlaylistInfoProp, any> {
  componentDidMount() {
  }

  handlePlay = () => {
    const { PlayerStore } = this.props
    if (!PlayerStore) {
      return;
    }
  }

  handleAddToPlaylist = () => {
    const { PlayerStore } = this.props
    if (!PlayerStore) {
      return;
    }
  }

  render() {
    const {
      UserStore, location: { search }
    } = this.props
    // debugger
    const id = qs.parse(search.substr(1)).id

    const playlist = UserStore.findPlaylistFromCurrentUser(id);
    if (!playlist) {
      return <noscript />
    }
    const { label_name, artwork_url, user, tracks } = playlist
    return (
      <div className={styles.playlistInfo}>
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
          tracks={tracks}
        />
      </div>
    );
  }
}

