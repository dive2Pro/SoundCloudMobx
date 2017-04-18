import * as React from 'react'
import { observer } from 'mobx-react'
import { FETCH_PLAYLIST } from '../../constants/fetchTypes'
import HocLoadingMore from '../HocLoadingMore'
import { Link } from 'react-router-dom'
import { IPlaylist, IisLoading } from '../../interfaces/interface';
import ArtWork from '../ArtWork'
import { UserModel } from '../../store/UserStore';
import { PlayerStore } from '../../store/PlayerStore';
const styles = require('./playlist.scss')
import makeLoadingSpinner from '../../Hoc/makeLoadingSpiner'
import makeTranslateXMotion from '../../Hoc/makeTranslateXMotion'


interface IPlaylistProps extends IisLoading {
  playerStore?: PlayerStore
  userModel: UserModel
  match?: any
}

@observer
class PlaylistItem extends React.PureComponent<{ info: IPlaylist }, any> {

  render() {
    const { artwork_url, label_name, id, title } = this.props.info
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
  }
}

@makeTranslateXMotion
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

      <div
        className={styles.playlist}
      >
        {playlists.map((item, i) => {
          return (
            <PlaylistItem
              info={item}
              key={item.id + '-info-' + i}
            />
          )
        })}
      </div>)
  }
}

export default HocLoadingMore<IPlaylistProps, any>(makeLoadingSpinner(Playlist, FETCH_PLAYLIST))



