import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { ITrackStore } from '../../store/TrackStore'
import { ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'
import Table, { ITableBody, ITableBodyItem } from '../Table'
import { seconds2time } from '../../services/utils'
interface IActivitiesProps {
  TrackStore?: ITrackStore
}


interface IndexAndPlayViewProp {
  index: number
  id: number
}

const IndexAndPlayView = ({ id, index }: IndexAndPlayViewProp) => {
  return (
    <div styleName="indexPlay">
      <span>{index}</span>
      <i className='fa fa-play'></i>
    </div>
  )
}
const StyledIndexAndPlayView = CSSModule(IndexAndPlayView, styles);

@inject('TrackStore')
@observer
class Activities extends React.Component<IActivitiesProps, any> {
  componentDidMount() {
    const { TrackStore } = this.props
    if (TrackStore)
      TrackStore.fetchActivities();
  }

  renderActivities = (arr: ITrack[]) => {
    const { TrackStore } = this.props;
    if (!TrackStore) { return (<noscript />) }
    // TODO
    const thead = [
      { title: "", width: 8 },
      { title: '歌曲标题', width: 30 }, {
        title: '时长', width: 10
      }, {
        title: '歌手', width: 10
      }, {
        title: '专辑', width: 15
      }
    ]
    const tbodys: ITableBody[] = [];
    arr.forEach((item, i) => {
      const { id, title, duration, user } = item.origin
      const { id: userId, username } = user
      const bodyItems: ITableBodyItem[] = [
        {
          title: '', render: () => {
            return (
              <StyledIndexAndPlayView index={i} id={id} />
            )
          }
        },
        { title },
        { title: seconds2time(duration), tag: 'anchor' },
        { title: username }
      ];

      tbodys.push({ trackId: id, singerId: userId, bodyData: bodyItems })
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
    const { isLoadingActivities, activities } = TrackStore;
    const isLoading = isLoadingActivities || !activities
    return (
      <div className="main">
        {isLoading ?
          <LoadingSpinner isLoading={isLoading} /> :
          this.renderActivities(activities)}}
      </div>
    );
  }
}

export default CSSModule(Activities, styles);