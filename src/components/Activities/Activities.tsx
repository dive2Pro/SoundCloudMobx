import * as React from 'react'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { ITrack } from '../../interfaces/interface';
import LoadingSpinner from '../LoadingSpinner'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import Stream from '../Stream'
import { PlayerStore } from "../../store/PlayerStore";
import { PLAYER_STORE } from '../../constants/storeTypes';
interface IActivitiesProps {
  playerStore?: PlayerStore
  isLoading: boolean,
  tracks: ITrack[],
  sortType: string
  scrollFunc?: () => void
  isError?: boolean
}

@inject(PLAYER_STORE)
@observer
class Activities extends React.Component<IActivitiesProps, any> {
  addToTrackList = (track: ITrack) => {
    const { playerStore } = this.props
    if (playerStore) {
      playerStore.addToPlaylist(track);
    }
  }
  render() {
    const {
      isLoading,
      tracks,
      sortType,
      isError,
      playerStore: store } = this.props;

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
          isError={isError}
          onErrorHandler={() => this.props.scrollFunc && this.props.scrollFunc()}
        />
      </div >
    );
  }
}

// let  ActivitiesCount = 0
// 这里不需要传入 type,因为已经在 TrackStore中setGenre的时候设置了
export default Hoc<IActivitiesProps, any>(Activities)
