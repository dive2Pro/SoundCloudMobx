import * as React from 'react'
import {inject, observer} from 'mobx-react'
import { FETCH_PLAYLIST } from '../../constants/fetchTypes'
import HocLoadingMore from '../HocLoadingMore'
import { IPlaylist, IisLoading } from '../../interfaces/interface';
import ArtWork from '../ArtWork'
import { UserModel } from '../../store/UserStore';
import { PlayerStore } from '../../store/PlayerStore';
const styles = require('./playlist.scss')
const Link = require("react-router-dom").Link;
import makeLoadingSpinner from '../../Hoc/makeLoadingSpiner'
import makeTranslateXMotion from '../../Hoc/makeTranslateXMotion'
import {PERFORMANCE_STORE} from "../../constants/storeTypes";
import {PerformanceStore} from "../../store/PerformanceStore";
import HocLoadingEmitLimit from "../HocLoadingMore/HocLoadingEmitLimit";


interface IPlaylistProps extends IisLoading {
  playerStore?: PlayerStore
  userModel: UserModel
  performanceStore?: PerformanceStore
  match?: any
}

@observer
class PlaylistItem extends React.PureComponent<{ info: IPlaylist,performanceStore?:PerformanceStore }, any> {
  render() {
    const { artwork_url, label_name, id, title } = this.props.info
    const to = { pathname: '/playlist', search: `?id=${id}` }
    const ps = this.props.performanceStore

    const artSize = ps?ps.getSizeWithSpecWidth(250,210,170,100):250;
    console.log(artwork_url,artSize)
    return (
      <div className={styles.itemContainer}>
        <Link to={to}>
          <ArtWork src={artwork_url} size={artSize} />
        </Link>
        <div className={styles.itemTitle}>
          <Link to={to}>
            <h3 className={styles.label_name}>{label_name || title}</h3>
          </Link>
        </div>
      </div>
    )
  }
}
@HocLoadingEmitLimit
@HocLoadingMore
@makeTranslateXMotion
@inject(PERFORMANCE_STORE)
@observer
class Playlist extends React.Component<IPlaylistProps, any>{

  componentDidMount() {
    const {
       userModel
    } = this.props
    userModel.fetchWithType(FETCH_PLAYLIST);
  }
  render() {
    const {performanceStore,userModel:{playlists}}=this.props

    return (
      <div
        className={styles.playlist}
      >
        {playlists.map((item, i) => {
          return (
            <PlaylistItem
              info={item}
              key={item.id + '-info-' + i}
              performanceStore={performanceStore}
            />
          )
        })}
      </div>)
  }
}

export default ((makeLoadingSpinner(Playlist, FETCH_PLAYLIST)))



