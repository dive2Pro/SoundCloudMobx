import * as React from 'react'

import HoverActions from '../HoverActions'
import { ITrack } from '../../interfaces/interface';
import { IPlayerStore } from '../../store'
const styles = require('./stream.scss')
import { seconds2time } from '../../services/utils'

interface IStreamExtends {
  track: ITrack
  , store: IPlayerStore
}




const StreamExtends = ({ store, track }: IStreamExtends) => {
  const {
     duration
  } = track
  const configurations = [
    {
      fn: () => {/***/ }, className: 'fa fa-share-square-o'
    }, {
      fn: () => {/***/ }, className: 'fa fa-folder-o'
    }
  ]


  return (
    <div style={{ display: 'flex', flex: 2 }}>
      <div className={styles._stream_duration}>
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
      <span className={styles._stream_settings}>
        <i>::</i>
      </span>
    </div>)
}

export default StreamExtends