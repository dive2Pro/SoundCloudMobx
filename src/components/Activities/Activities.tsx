import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { ITrackStore } from '../../store/TrackStore'
import { IPlayerStore } from '../../store/PlayerStore'
import { IActivitiesItem, ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'
import Table, { ITableBody, ITableBodyItem } from '../Table'
import { seconds2time } from '../../services/utils'
import ButtonInline from '../ButtonInline'
import HocLoading from '../HocLoadingMore'
import { Action } from '../HoverActions'
import * as sortTypes from '../../constants/sortTypes'
interface IActivitiesProps {
  TrackStore: ITrackStore
  PlayerStore: IPlayerStore
}


interface IndexAndPlayViewProp {
  index: number
  track: ITrack
  onClick: (track: ITrack) => void
}

const IndexAndPlayView = ({ track, onClick, index }: IndexAndPlayViewProp) => {
  return (
    <div styleName="indexPlay">
      {/*<span>{index}</span>*/}

      <ButtonInline onClick={() => onClick(track)}>
        <i className='fa fa-play'></i>
      </ButtonInline>

    </div>
  )
}

const StyledIndexAndPlayView = CSSModule(IndexAndPlayView, styles);


interface TdTrackTitleViewProp {
  track: ITrack
  trackStore: ITrackStore
}

const TdTrackTitleView = observer(({ track, trackStore }: TdTrackTitleViewProp) => {
  const { user, title, playback_count, favoritings_count, comment_count, download_count } = track;
  const { username } = user
  const { sortType } = trackStore;
  const activeStyle = { color: '#14ff00' }

  return (
    <div>
      <h5><span>{title}</span> - <span>{username}</span></h5>
      <div>
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
@inject('PlayerStore', 'TrackStore')
@observer
class Activities extends React.Component<IActivitiesProps, any> {
  componentDidMount() {
    const { TrackStore } = this.props
    if (TrackStore)
      TrackStore.fetchActivities();
  }
  playTrack = (track: ITrack) => {
    const { PlayerStore } = this.props
    if (PlayerStore) {
      PlayerStore.setPlayingTrack(track);
    }
  }

  renderActivities = (arr: IActivitiesItem[]) => {
    const { TrackStore } = this.props;
    if (!TrackStore) { return (<noscript />) }
    // TODO

    const thead = [
      { title: "", width: 8 },
      { title: '歌曲标题', width: 30 }, {
        title: '时长', width: 10
      }, {
        title: '歌手', width: 10
      }
    ]
    const tbodys: ITableBody[] = [];
    arr.filter(item => item.origin).forEach((item, i) => {
      const { id, title, duration, user } = item.origin
      const { id: userId, username } = user
      const configurations = [
        {
          fn: () => { },
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
              <StyledIndexAndPlayView index={i} track={item.origin} onClick={this.playTrack} />
            )
          }
        },
        {
          title, render: () => {
            return (<TdTrackTitleView trackStore={TrackStore} track={item.origin} />)
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
    const TrackStore = this.props.TrackStore;
    if (!TrackStore) {
      return (<noscript />)
    }
    const { isLoadingActivities, filteredActivities: activities, activitiesCount } = TrackStore;

    const isLoading = isLoadingActivities || !activities
    return (
      <div className={styles.main}>
        <div className={styles.top}>
          <div>
            <h3>歌曲列表</h3>
            <span>{activitiesCount}首歌</span>
          </div>
          <span>播放<span>{}</span>次</span>
        </div>
        {this.renderActivities(activities)}
        <LoadingSpinner isLoading={isLoading} />
      </div>
    );
  }
}

export default HocLoading(Activities)