import * as React from 'react';
import {
  // inject,
  observer
} from 'mobx-react';
import {ITrack} from '../../interfaces/interface';
const styles = require('./stream.scss');
import StreamExtends from './StreamExtends';
import StreamMain from './StreamMain';
import {PlayerStore} from '../../store/PlayerStore';
const isEqual = require('lodash/isEqual');
// import makeOpacityMotion, { IAddtionalProps } from '../../Hoc/makeOpacityMotion'

interface IStreamProps {
  track: ITrack;
  store: PlayerStore;
  type: string;
  i: number;
  additionalStyles?: {opacity: number; height: number};
}

@observer
class Stream extends React.PureComponent<IStreamProps, any> {
  render() {
    const {track, store, type, i, additionalStyles, ...rest} = this.props;
    const handleSectionClick = (e: any) => {
      const name = e.target.className;
      if (
        name === styles._stream_act_plus ||
        e.target.tagName === 'A' ||
        e.target.tagName === 'I'
      ) {
        /** */
      } else {
        store.setPlayingTrack(track);
      }
    };
    let style = {};
    if (additionalStyles) {
      style = {
        opacity: additionalStyles.opacity,
        height: additionalStyles.height + '%'
      };
    }

    const imCurrentPlayingTrack = isEqual(track, store.playingTrack);

    return (
      <section
        onClick={e => handleSectionClick(e)}
        className={styles._stream}
        style={style}
      >
        <span className={styles._stream_position}>
          {imCurrentPlayingTrack
            ? <em className={`fa fa-volume-up ${styles.mainColor}`} />
            : i}
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
        <StreamMain store={store} track={track} {...rest} />
        <StreamExtends store={store} track={track} {...rest} />
      </section>
    );
  }
}

export default Stream;
