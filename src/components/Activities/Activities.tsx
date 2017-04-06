import * as React from 'react'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { IPlayerStore, IPerformanceStore } from '../../store'
import { ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'

import { seconds2time } from '../../services/utils'
import ButtonInline from '../ButtonInline'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import ArtWork from '../ArtWork';
import HoverActions from '../HoverActions'
import { Link } from 'react-router-dom'
interface IActivitiesProps {
  PlayerStore?: IPlayerStore
  PerformanceStore?: IPerformanceStore
  isLoading: boolean,
  tracks: ITrack[],
  sortType: string
}


interface IndexAndPlayViewProp {
  index: number
  track: ITrack
  onClick: (track: ITrack) => void
  isPlaying: boolean
  isHidden: boolean
}

const IndexAndPlayView =
  observer(function IndexAndPlayView({ track, onClick, index, isPlaying, isHidden }: IndexAndPlayViewProp)
    : React.ReactElement<any> {
    const { artwork_url } = track
    const imgSize = 50;
    const styleSize = {
      width: imgSize,
      height: imgSize
    }
    const divClazz = isHidden ? styles.indexPlay : styles.active;
    return (
      <div className={divClazz}>
        {/*<span>{index}</span>*/}
        <ArtWork
          src={artwork_url}
          size={imgSize} />
        <div className={styles.play} style={styleSize}>
          <ButtonInline onClick={onClick}>
            <i className={`fa fa-${!isHidden && isPlaying ? 'pause' : 'play '} fa-2x`} />
          </ButtonInline>
        </div>

      </div>
    )
  });

interface ISongViewProps {
  track: ITrack, store: IPlayerStore, sortType: string, i: number,
  onClick: () => void
}

const SongView = observer(({ track, store, sortType, i, onClick }: ISongViewProps) => {
  const { isPlaying, playingTrack } = store
  const { user, label_name,
    id,
    duration
  } = track
  const { username } = user
  const configurations = [
    {
      fn: () => { }, className: "fa fa-share-square-o"
    }, {
      fn: () => { }, className: 'fa fa-folder-o'
    }
  ]
  const isHidden = !playingTrack || playingTrack.id !== id;
  return (
    <section
      onClick={onClick}
      className={styles._song}>
      <span className={styles._song_position}
      >{i}</span>
      <span
        onClick={() => { store.addToPlaylist(track) }}
        className={styles._song_act_plus}>
        <i className='fa fa-plus'></i>
      </span>
      <IndexAndPlayView
        isPlaying={isPlaying}
        isHidden={isHidden}
        track={track}
        index={i}
        onClick={onClick} />
      <div className={styles._song_info}>

        <Link to={{
          pathname: '/song',
          search: `?id=${id}`
        }}>  <span className={styles._song_info_title}>{label_name}</span>
        </Link>
        <Link to={{
          pathname: '/users'
          , search: `?id=${user.id}`
        }}> <span className={styles._song_info_author}>{username}</span>
        </Link>
      </div>
      <div className={styles._song_duration}>
        <div className={styles.duration}>
          {seconds2time(duration)}
        </div>

        <div className={styles.actions}>
          <HoverActions
            configurations={configurations}
            isVisible={true} />
        </div>
      </div>
      <span className={styles._song_settings}>
        <i>::</i>
      </span>
    </section >
  );
})
@inject('PlayerStore', 'PerformanceStore')
@observer
class Activities extends React.Component<IActivitiesProps, any> {
  dFunc: any;

  playTrack = (track: ITrack) => {
    const { PlayerStore } = this.props
    if (PlayerStore) {
      PlayerStore.setPlayingTrack(track);
    }
  }

  addToTrackList = (track: ITrack) => {
    const { PlayerStore } = this.props
    if (PlayerStore) {
      PlayerStore.addToPlaylist(track);
    }
  }
  render() {

    const { isLoading, tracks, sortType, PlayerStore: store } = this.props;
    if (!store || !tracks) {
      return <noscript />
    }

    return (
      <div className={styles.main}>
        <div className={styles.tracks}>
          {tracks.map((item, i) =>
            <SongView
              key={item.id + "-" + i}
              sortType={sortType}
              track={item}
              onClick={() => this.playTrack(item)}
              i={i + 1}
              store={store} />)
          }
        </div>
        <LoadingSpinner isLoading={isLoading} />
      </div >
    );
  }
}

// let  ActivitiesCount = 0
// 这里不需要传入 type,因为已经在 TrackStore中setGenre的时候设置了
export default Hoc<IActivitiesProps, any>(Activities)
