import * as React from 'react'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { IPlayerStore, IPerformanceStore } from '../../store'
import { ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'

import { seconds2time } from '../../services/utils'
import ButtonInline from '../ButtonInline'
import HocLoading from '../HocLoadingMore'
import ArtWork from '../ArtWork';
import TdTrackTitleView from '../TrackTitleView'
import HoverActions from '../HoverActions'

// const isEqual = require('lodash/isEqual')
const debounce = require('lodash/debounce')
// import { IObservableArray } from ".3.1.7@mobx/lib/mobx";
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

  /*
    renderActivities = (arr: ITrack[], store: IPlayerStore, sortType: string) => {
      if (!store) {
        console.error("PlayerStore = " + store)
        return (<noscript />)
      }
      const { playingTrack, isPlaying } = store;
      const thead = [
        { title: "", width: 8 },
        { title: '歌曲标题', width: 25 }, {
          title: '时长', width: 12
        }, {
          title: '歌手', width: 13
        }
      ]
      const tbodys: ITableBody[] = [];
      // 这里重复了! 上层有被调用这里就会计算
      arr.forEach((item, i) => {
        const { id, title, duration, user } = item
        const { id: userId, username } = user
        const configurations = [
          {
            fn: () => { this.addToTrackList(item) },
            className: `fa fa-plus`
          }
          , {
            fn: () => { }, className: "fa fa-share-square-o"
          }, {
            fn: () => { }, className: 'fa fa-folder-o'
          }
        ]
        const bodyItems: ITableBodyItem[] = [
          {
            title: '', render: () => {
              return (
                <IndexAndPlayView
                  isPlaying={isPlaying && playingTrack === item}
                  index={i} track={item} onClick={() => this.playTrack(item)} />
              )
            }
          },
          {
            title, render: () => {
              return (<TdTrackTitleView sortType={sortType} track={item} />)
            }
          },
          { title: seconds2time(duration), tag: 'anchor' },
          { title: username }
        ];
        tbodys.push({
          trackId: id
          , singerId: userId
          , bodyData: bodyItems
          , configurations
        })
      })
      return (
        <Table thead={thead} tbody={tbodys} />
      )
    }*/

  debounceFun = () => {
    const lowLimit = window.innerHeight + window.scrollY;
    const hightLimit = window.scrollY;
    {/*console.log(lowLimit, hightLimit);*/ }

    {/*if (!isEqual(this.state.limit, nextState.limit)) {*/ }
    this.props.PerformanceStore && this.props.PerformanceStore.setScrollLimit(lowLimit, hightLimit)
    {/*}*/ }
  }

  componentDidMount() {
    this.dFunc = debounce(this.debounceFun, 600)
    window.addEventListener('scroll', this.dFunc)
  }

  componentWiiUnmount() {
    window.removeEventListener('scroll', this.dFunc)
  }
  state = { limit: [] }

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

export default HocLoading<IActivitiesProps, any>(Activities)