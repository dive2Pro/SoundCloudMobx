import * as React from 'react'
import {
  // inject,
  observer
} from 'mobx-react';
import { seconds2time } from '../../services/utils'
import { ITrack } from '../../interfaces/interface';
import { IPlayerStore } from '../../store'
const styles = require('./stream.scss')

import ButtonInline from '../ButtonInline'
import ArtWork from '../ArtWork';

import HoverActions from '../HoverActions'
import { Link } from 'react-router-dom'

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

const IndexAndPlayView =
  observer(function IndexAndPlayView({ track, index, isPlaying, isHidden, onClick }: IndexAndPlayViewProp):
    React.ReactElement<any> {
    const { artwork_url } = track
    const imgSize = 50;
    const styleSize = {
      width: imgSize,
      height: imgSize
    }
    const divClazz = isHidden ? styles.indexPlay : styles.active;
    return (
      <div className={divClazz}>
        <ArtWork
          src={artwork_url}
          size={imgSize}
        />
        <div className={styles.play} style={styleSize}>
          <ButtonInline onClick={onClick}>
            <i className={`fa fa-${(!isHidden && isPlaying) ? 'pause' : 'play '} fa-2x`} />
          </ButtonInline>
        </div>

      </div>
    )
  });




const Stream = observer(({ track, store, sortType, i }: IStreamProps) => {
  const { isPlaying, playingTrack } = store
  const { user, title,
    id,
    duration
  } = track
  const { username } = user
  const configurations = [
    {
      fn: () => {/***/ }, className: 'fa fa-share-square-o'
    }, {
      fn: () => {/***/ }, className: 'fa fa-folder-o'
    }
  ]
  const handleSectionClick = (e: any) => {
    const name = e.target.className
    if (name === (styles._stream_act_plus) || e.target.tagName === 'A' || e.target.tagName === 'I') {
      /** */
    } else {
      store.setPlayingTrack(track)
    }
  }
  const isHidden = !playingTrack || playingTrack.id !== id;
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
      <IndexAndPlayView
        isPlaying={isPlaying}
        isHidden={isHidden}
        track={track}
        onClick={() => store.setPlayingTrack(track)}
        index={i}
      />
      <div className={styles._stream_info}>

        <Link
          className={styles._stream_info_title}
          to={{
            pathname: '/stream',
            search: `?id=${id}`
          }}
        >
          {title}
        </Link>

        <Link
          className={styles._stream_info_author}
          to={{
            pathname: '/users'
            , search: `?id=${user.id}`
          }}
        >  {username}
        </Link>
      </div>
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
    </section >
  );
})
export default Stream;