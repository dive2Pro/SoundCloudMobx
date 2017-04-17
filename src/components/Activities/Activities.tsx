import * as React from 'react'
const styles = require('./activities.scss')
import { observer, inject } from 'mobx-react';
import { ITrack } from '../../interfaces/interface';
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import Stream from '../Stream'
import { PlayerStore } from '../../store/PlayerStore';
import { PLAYER_STORE } from '../../constants/storeTypes';
import makeLoadingSpinner from '../../Hoc/makeLoadingSpiner'
import makeOpacityTransition, { IAddtionalProps } from '../../Hoc/makeOpacityTransition'
import makeTranslateXMotionWrapper from '../../Hoc/makeTranslateXStragged'

interface IActivitiesProps extends IAddtionalProps {
  playerStore?: PlayerStore
  isLoading: boolean,
  datas: ITrack[],
  type: string
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
      datas,
      type,
      playerStore: store
      , interpolatedStyles
    } = this.props;

    if (!store || !datas) {
      return <noscript />
    }

    return (
      <div className={styles.main}>
        <div className={styles.tracks}>
          {
            interpolatedStyles ? interpolatedStyles.map((item, i) => {
              const style: any = item.style || item

              const track: any = item.data || datas[i]

              return (
                <div
                  key={item.key + track.id + '-' + i}
                  style={{
                    ...style, left: `${style.left}`
                  }}>
                  <Stream
                    type={type}
                    track={track}
                    i={i + 1}
                    store={store}
                  />
                </div>
              )
            }) : datas.map((item, i) => {
              return (
                <Stream
                  key={item.id + '-' + i}
                  type={type}
                  track={item}
                  i={i + 1}
                  store={store}
                />
              )
            })}
        </div>
      </div >
    );
  }
}


// let  ActivitiesCount = 0
// 这里不需要传入 type,因为已经在 TrackStore中setGenre的时候设置了
export default Hoc(
  // makeOpacityTransition(
  makeLoadingSpinner(
    // makeTranslateXMotionWrapper(
    Activities
    // )
    // , styles.main
  )
)
