import * as React from 'react'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { IPlayerStore, IPerformanceStore } from '../../store'
import { ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import Stream from '../Stream'
interface IActivitiesProps {
  PlayerStore?: IPlayerStore
  PerformanceStore?: IPerformanceStore
  isLoading: boolean,
  tracks: ITrack[],
  sortType: string
  scrollFunc?: () => void
  isError: boolean
}

@inject('PlayerStore', 'PerformanceStore')
@observer
class Activities extends React.Component<IActivitiesProps, any> {
  addToTrackList = (track: ITrack) => {
    const { PlayerStore } = this.props
    if (PlayerStore) {
      PlayerStore.addToPlaylist(track);
    }
  }
  render() {
    const {
      isLoading,
      tracks,
      sortType,
      PlayerStore: store } = this.props;

    if (!store || !tracks) {
      return <noscript />
    }
    return (
      <div className={styles.main}>
        <div className={styles.tracks}>
          {tracks.map((item, i) => (
            <Stream
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
