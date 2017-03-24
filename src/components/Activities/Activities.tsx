import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { IPlayerStore } from '../../store/PlayerStore'
import { ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'
import Table, { ITableBody, ITableBodyItem } from '../Table'
import { seconds2time } from '../../services/utils'
import ButtonInline from '../ButtonInline'
import HocLoading from '../HocLoadingMore'
import { Action } from '../HoverActions'
import * as sortTypes from '../../constants/sortTypes'
import ArtWork from '../ArtWork';
interface IActivitiesProps {
  PlayerStore?: IPlayerStore
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

const IndexAndPlayView = observer(({ track, onClick, index, isPlaying }: IndexAndPlayViewProp): React.ReactElement<any> => {
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
      <ArtWork src={artwork_url} size={imgSize} />
      <div className={styles.play} style={styleSize}>
        <ButtonInline onClick={onClick}>
          <i className={`fa fa-${isPlaying ? 'pause' : 'play '} fa-3x`}></i>
        </ButtonInline>
      </div>

    </div>
  )
});

const StyledIndexAndPlayView = CSSModule(IndexAndPlayView, styles);


interface TdTrackTitleViewProp {
  track: ITrack
  sortType: string
}

const TdTrackTitleView = observer(({ track, sortType }: TdTrackTitleViewProp) => {
  const { user, title, playback_count, favoritings_count, comment_count, download_count } = track;
  const { username } = user
  const activeStyle = { color: '#14ff00' }

  return (
    <div className={styles.track_info}>
      <h5><span>{title}</span> - <span>{username}</span></h5>
      <div className={styles.track_counts}>
        <Action
          activeStyle={sortType == sortTypes.SORT_PLAYBACK_COUNT ? activeStyle : {}}
          className='fa fa-play'
          children={playback_count}
        />
        <Action
          activeStyle={sortType == sortTypes.SORT_FAVORITINGS_COUNT ? activeStyle : {}}
          className='fa fa-favorite'
          children={favoritings_count} />
        <Action
          activeStyle={sortType == sortTypes.SORT_COMMENT_COUNT ? activeStyle : {}}
          className='fa fa-comment'
          children={comment_count} />

        <Action
          activeStyle={sortType == sortTypes.SORT_DOWNLOAD_COUNT ? activeStyle : {}}
          className='fa fa-download'
          children={download_count} />
      </div>
    </div>
  )
})


@CSSModule(styles)
@inject('PlayerStore')
@observer
class Activities extends React.Component<IActivitiesProps, any> {

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
  renderActivities = (arr: ITrack[], store: IPlayerStore, sortType: string) => {
    if (!store) {
      console.error("PlayerStore = " + store)
      return (<noscript />)
    }
    const { playingTrack, isPlaying } = store;
    const thead = [
      { title: "", width: 8 },
      { title: '歌曲标题', width: 30 }, {
        title: '时长', width: 10
      }, {
        title: '歌手', width: 10
      }
    ]
    const tbodys: ITableBody[] = [];
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
              <StyledIndexAndPlayView
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
        trackId: id, singerId: userId,
        bodyData: bodyItems, configurations
      })
    })
    return (
      <Table thead={thead} tbody={tbodys} />
    )
  }

  render() {

    const { isLoading, tracks, sortType } = this.props;
    const tracksCount = tracks.length;
    const store = this.props.PlayerStore
    if (!store) {
      return <noscript />
    }
    return (
      <div className={styles.main}>
        <div className={styles.top}>
          <div>
            <h3>歌曲列表</h3>
            <span>{tracksCount}首歌</span>
          </div>
        </div>
        <div className={styles.tracks}>
          {this.renderActivities(tracks, store, sortType)}
        </div>
        <LoadingSpinner isLoading={isLoading} />
      </div>
    );
  }
}

export default HocLoading(Activities)