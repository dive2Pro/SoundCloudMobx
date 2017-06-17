import * as React from 'react';
const styles = require('./stream.scss');
import {NavLink} from 'react-router-dom';
import {ITrack} from '../../interfaces/interface';

import ButtonInline from '../ButtonInline';
import ArtWork from '../ArtWork';
import {observer, inject} from 'mobx-react';
import {PlayerStore} from '../../store/PlayerStore';
import * as ReactDOM from 'react-dom';
import {PERFORMANCE_STORE} from '../../constants/storeTypes';
import {PerformanceStore} from '../../store/PerformanceStore';

interface IStreamMainProp {
  track: any;
  store: PlayerStore;
  performanceStore?: PerformanceStore;
  withinPlayer?: boolean;
  ellipisMaxWidth?: number;
}

interface IndexAndPlayViewProp {
  track: ITrack;
  isPlaying: boolean;
  isHidden: boolean;
  onClick: () => void;
}

const IndexAndPlayView = observer(function IndexAndPlayView({
  track,
  isPlaying,
  isHidden,
  onClick
}: IndexAndPlayViewProp): React.ReactElement<any> {
  const {artwork_url} = track;
  const imgSize = 50;
  const styleSize = {
    width: imgSize,
    height: imgSize
  };
  const divClazz = isHidden ? styles.indexPlay : styles.active;
  return (
    <div className={divClazz}>
      <ArtWork src={artwork_url} size={imgSize} />
      <div className={styles.play} style={styleSize}>
        <ButtonInline onClick={onClick}>
          <i
            className={`fa fa-${!isHidden && isPlaying
              ? 'pause'
              : 'play '} fa-2x`}
          />
        </ButtonInline>
      </div>

    </div>
  );
});

const StreamMain = inject(PERFORMANCE_STORE)(
  observer(
    ({
      ellipisMaxWidth,
      withinPlayer,
      store,
      track,
      performanceStore
    }: IStreamMainProp) => {
      const {isPlaying, playingTrack} = store;
      // todo
      if (track.slice && Array.isArray(track.slice())) {
        track = track[0];
      }

      const {user, title, id} = track;

      const {username} = user;
      let streamMain;
      const isHidden = !playingTrack || playingTrack.id !== id;

      const handlePlayStream = event => {
        if (!performanceStore) {
          return;
        }
        const root = streamMain;
        if (performanceStore.isUnderMedium && !withinPlayer) {
          store.setPlayingTrack(track);
          event.preventDefault();
        }
      };

      return (
        <div
          onClickCapture={handlePlayStream}
          ref={n => (streamMain = n)}
          className={styles._stream_main}
        >
          <IndexAndPlayView
            isPlaying={isPlaying}
            isHidden={isHidden}
            track={track}
            onClick={() => store.setPlayingTrack(track)}
          />
          <div className={styles._stream_info}>

            <NavLink
              className={styles._stream_info_title}
              to={{
                pathname: '/stream',
                search: `?id=${id}`
              }}
              style={{maxWidth: ellipisMaxWidth}}
            >
              {title}
            </NavLink>

            <NavLink
              className={styles._stream_info_author}
              to={{
                pathname: '/users',
                search: `?id=${user.id}`
              }}
            >
              {username}
            </NavLink>
          </div>

        </div>
      );
    }
  )
);

export default StreamMain;
