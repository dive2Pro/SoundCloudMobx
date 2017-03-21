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
interface IActivitiesProps {
  TrackStore?: ITrackStore
  PlayerStore?: IPlayerStore
}


interface IndexAndPlayViewProp {
  index: number
  track: ITrack
  onClick: (track: ITrack) => void
}

const IndexAndPlayView = ({ track, onClick, index }: IndexAndPlayViewProp) => {
  return (
    <div styleName="indexPlay">
      <span>{index}</span>
      <ButtonInline onClick={() => onClick(track)}>
        <i className='fa fa-play'></i>
      </ButtonInline>
    </div>
  )
}
const StyledIndexAndPlayView = CSSModule(IndexAndPlayView, styles);

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
      // , {
      // titlse: '专辑', width: 15
      // }
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
        { title },
        { title: seconds2time(duration), tag: 'anchor' },
        { title: username }
      ];
      tbodys.push({
        trackId: id, singerId: userId,
        bodyData: bodyItems, configurations
      })
    })
    console.log('-------------------------' + tbodys.length)
    return (
      <Table thead={thead} tbody={tbodys} />
    )
  }

  render() {
    const TrackStore = this.props.TrackStore;
    if (!TrackStore) {
      return (<noscript />)
    }
    const { isLoadingActivities, activities, activitiesCount } = TrackStore;

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
        {isLoading ?
          <LoadingSpinner isLoading={isLoading} /> :
          this.renderActivities(activities)}}
      </div>
    );
  }
}

export default Activities 