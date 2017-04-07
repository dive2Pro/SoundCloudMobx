import * as React from 'react'
import {
  // inject,
  observer
} from 'mobx-react';
import { ITrack } from '../../interfaces/interface';
import { IPlayerStore } from '../../store'
const styles = require('./stream.scss')
import StreamExtends from './StreamExtends'
import StreamMain from './StreamMain'


interface IStreamProps {
  track: ITrack, store: IPlayerStore, sortType: string, i: number,
}


interface IndexAndPlayViewProp {
  index: number
  track: ITrack
  isPlaying: boolean
  isHidden: boolean
  onClick: () => void
}




const Stream = observer(({ track, store, sortType, i }: IStreamProps) => {

  const handleSectionClick = (e: any) => {
    const name = e.target.className
    if (name === (styles._stream_act_plus) || e.target.tagName === 'A' || e.target.tagName === 'I') {
      /** */
    } else {
      store.setPlayingTrack(track)
    }
  }
  return (
    <section
      onClick={(e) => handleSectionClick(e)}
      className={styles._stream}
    >
      <span
        className={styles._stream_position}
      >{i}
      </span>
      <span
        onClick={(e: any) => {
          e.preventDefault();
          store.addToPlaylist(track);
        }}
        className={styles._stream_act_plus}
      >
        <i className="fa fa-plus" />
      </span>
      <StreamMain store={store} track={track} />
      <StreamExtends store={store} track={track} />
    </section >
  );
})
export default Stream;