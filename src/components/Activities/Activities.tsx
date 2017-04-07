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
  scrollFunc?: () => void
}

interface IndexAndPlayViewProp {
  index: number
  track: ITrack
  isPlaying: boolean
  isHidden: boolean
  onClick: () => void
}

const IndexAndPlayView =
  observer(function IndexAndPlayView({ track, index, isPlaying, isHidden, onClick }: IndexAndPlayViewProp):
    React.ReactElement<any> {
    const { artwork_url } = track
    const imgSize = 50;
    const styleSize = {
      width: imgSize,
      height: imgSize
    }
    const divClazz = isHidden ? styles.indexPlay : styles.active;
    return (
      <div className={divClazz}>
        <ArtWork
          src={artwork_url}
          size={imgSize}
        />
        <div className={styles.play} style={styleSize}>
          <ButtonInline onClick={onClick}>
            <i className={`fa fa-${(!isHidden && isPlaying) ? 'pause' : 'play '} fa-2x`} />
          </ButtonInline>
        </div>

      </div>
    )
  });

interface ISongViewProps {
  track: ITrack, store: IPlayerStore, sortType: string, i: number,
}

const SongView = observer(({ track, store, sortType, i }: ISongViewProps) => {
  const { isPlaying, playingTrack } = store
  const { user, title,
    id,
    duration
  } = track
  const { username } = user
  const configurations = [
    {
      fn: () => {/***/ }, className: 'fa fa-share-square-o'
    }, {
      fn: () => {/***/ }, className: 'fa fa-folder-o'
    }
  ]
  const handleSectionClick = (e: any) => {
    const name = e.target.className
    if (name === (styles._song_act_plus) || e.target.tagName === 'A' || e.target.tagName === 'I') {
      /** */
    } else {
      store.setPlayingTrack(track)
    }
  }
  const isHidden = !playingTrack || playingTrack.id !== id;
  return (
    <section
      onClick={(e) => handleSectionClick(e)}
      className={styles._song}
    >
      <span
        className={styles._song_position}
      >{i}
      </span>
      <span
        onClick={(e: any) => {
          e.preventDefault();
          store.addToPlaylist(track);
        }}
        className={styles._song_act_plus}
      >
        <i className="fa fa-plus" />
      </span>
      <IndexAndPlayView
        isPlaying={isPlaying}
        isHidden={isHidden}
        track={track}
        onClick={() => store.setPlayingTrack(track)}
        index={i}
      />
      <div className={styles._song_info}>

        <Link
          className={styles._song_info_title}
          to={{
            pathname: '/song',
            search: `?id=${id}`
          }}
        >
          {title}
        </Link>

        <Link
          className={styles._song_info_author}
          to={{
            pathname: '/users'
            , search: `?id=${user.id}`
          }}
        >  {username}
        </Link>
      </div>
      <div className={styles._song_duration}>
        <div className={styles.duration}>
          {seconds2time(duration)}
        </div>

        <div className={styles.actions}>
          <HoverActions
            configurations={configurations}
            isVisible={true}
          />
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
    console.info('isLoading = ' + isLoading)
    return (
      <div className={styles.main}>
        <div className={styles.tracks}>
          {tracks.map((item, i) => (
            <SongView
              key={item.id + '-' + i}
              sortType={sortType}
              track={item}
              i={i + 1}
              store={store}
            />))
          }
        </div>
        <LoadingSpinner
          isLoading={isLoading}
          isError={true}
          onErrorHandler={() => this.props.scrollFunc && this.props.scrollFunc()}
        />
      </div >
    );
  }
}

// let  ActivitiesCount = 0
// 这里不需要传入 type,因为已经在 TrackStore中setGenre的时候设置了
export default Hoc<IActivitiesProps, any>(Activities)
