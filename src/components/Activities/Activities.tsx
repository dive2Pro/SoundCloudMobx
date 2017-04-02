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
import TdTrackTitleView from '../TrackTitleView'
import HoverActions from '../HoverActions'

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
}

const IndexAndPlayView =
  observer(function IndexAndPlayView({ track, onClick, index, isPlaying }: IndexAndPlayViewProp)
    : React.ReactElement<any> {
    const { artwork_url } = track
    const imgSize = 80;
    const styleSize = {
      width: imgSize,
      height: imgSize
    }
    const divClazz = isPlaying ? styles.active : styles.indexPlay;
    return (
      <div className={divClazz}>
        {/*<span>{index}</span>*/}
        <ArtWork
          src={artwork_url}
          size={imgSize} />
        <div className={styles.play} style={styleSize}>
          <ButtonInline onClick={onClick}>
            <i className={`fa fa-${isPlaying ? 'pause' : 'play '} fa-3x`}></i>
          </ButtonInline>
        </div>

      </div>
    )
  });

interface ITableIdsProps {
  track: ITrack, store: IPlayerStore, sortType: string, i: number
}

const TableTds = observer(({ track, store, sortType, i }: ITableIdsProps) => {
  if (!store || !track) {
    console.error("PlayerStore = " + store)
    return (<noscript />)
  }
  let { duration, user } = track;
  const { isPlaying, playingTrack } = store
  // const preKey = UniqueKey[UniqueKey.length - 1].length++;
  const configurations = [
    {
      fn: () => { store.addToPlaylist(track) },
      className: `fa fa-plus`
    }
    , {
      fn: () => { }, className: "fa fa-share-square-o"
    }, {
      fn: () => { }, className: 'fa fa-folder-o'
    }
  ]

  const anchorClazz = (isPlaying && (playingTrack === track)) ? styles.liveanchor : styles.anchor;

  // key={track.id + " - " + 'TableIds'}
  return (
    <tr
      className={styles.ttr}>
      <td >
        <IndexAndPlayView
          isPlaying={isPlaying && playingTrack === track}
          track={track}
          index={i}
          onClick={() => { store.setPlayingTrack(track) }}
        />
      </td>
      <td>
        <TdTrackTitleView sortType={sortType} track={track} />
      </td>

      <td
        className={anchorClazz}
      >
        <div className={styles.duration}>
          {seconds2time(duration)}
        </div>
        <div className={styles.actions}>
          <HoverActions
            configurations={configurations}
            isVisible={true} />
        </div>
      </td>
      <td>
        <div className={styles.duration}>{user.username}</div>
      </td>
    </tr >)
}
);

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

    const { isLoading, tracks, sortType } = this.props;
    const store = this.props.PlayerStore
    if (!store || !tracks) {
      return <noscript />
    }
    //ont over render
    // console.log(' ActivitiesCount = ' + ActivitiesCount++)
    const tracksCount = tracks.length;
    const thead = [
      { title: "", width: 8 },
      { title: '歌曲标题', width: 25 }, {
        title: '时长', width: 12
      }, {
        title: '歌手', width: 13
      }
    ]
    console.log('tracksCount = ' + tracksCount)
    return (
      <div className={styles.main}>
        <div className={styles.top}>
          <div>
            <h3>歌曲列表</h3>
            <span>{tracksCount}首歌</span>
          </div>
        </div>
        <div className={styles.tracks}>
          <table>
            <thead>
              <tr>
                {thead.map((item, i) => {
                  const { title, width } = item
                  return (
                    <th key={i + "-" + width} width={width + "%"}>
                      {title}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {tracks.map((item, i) => <TableTds
                key={item.id + "-" + i}
                sortType={sortType}
                track={item}
                i={i}
                store={store} />)}
            </tbody>
          </table>
        </div>
        <LoadingSpinner isLoading={isLoading} />
      </div >
    );
  }
}

// let  ActivitiesCount = 0
// 这里不需要传入 type,因为已经在 TrackStore中setGenre的时候设置了
export default Hoc<IActivitiesProps, any>(Activities)
