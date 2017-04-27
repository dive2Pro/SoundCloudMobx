import * as React from 'react';
import { inject, observer } from 'mobx-react';
import ButtonInline from '../ButtonInline';
import HoverActions from '../HoverActions'
const styles = require('./playerlist.scss');
import { StreamMain } from '../Stream'
import { ITrack } from '../../interfaces/interface';
import { PlayerStore } from '../../store/PlayerStore';
import {PERFORMANCE_STORE, PLAYER_STORE} from '../../constants/storeTypes';
import makeDumbProps from '../../Hoc/makeDumbProps';
import {PerformanceStore} from "../../store/PerformanceStore";

interface IPlaylistProp {
  playerStore: PlayerStore
  performanceStore: PerformanceStore
}
interface IPlaylistItemProp {
  track: ITrack
  store: PlayerStore
  performanceStore: PerformanceStore

}

const PlaylistItem = observer(({performanceStore, track, store }: IPlaylistItemProp) => {
  const { playingTrack } = store
  const isPlaying = playingTrack ? playingTrack.id === track.id : false;
  const isHidden = !playingTrack || playingTrack.id !== track.id;

  const configurations = [{
    fn: () => { store.setPlayingTrack(track) },
    className: `fa fa-${isPlaying ? 'pause' : 'play'}`
    , style: { width: 20, height: 20 }
  },
  {
    fn: () => { store.removeFromPlaylist(track) },
    className: 'fa fa-trash',
    style: { width: 20, height: 20 }
  }
  ];

  const ellipisMaxWidth = performanceStore.isUnderHandsets?200:300;
  performanceStore.isUnderHandsets&&configurations.shift();
  return (
    <div className={styles.playlistitem}>
      <StreamMain
        track={track}
        store={store}
        ellipisMaxWidth={ellipisMaxWidth}
      />
      <div
        className={styles.playlistitem_hover}
      >
        <HoverActions
          isVisible={!isHidden}
          configurations={configurations}
        />
      </div>
    </div >
  )
})


@inject(PLAYER_STORE,PERFORMANCE_STORE)
@observer
class Playerlist extends React.Component<IPlaylistProp, any> {


  handleClearlist = () => {
    const playerStore = this.props.playerStore;
    playerStore.clearPlaylist();
  };

  render() {
    const { playerStore,performanceStore } = this.props;

    const { playList, isPlaylistOpen } = playerStore;
    const mainClass = isPlaylistOpen ? styles.main : styles.none;

    return (
      <div className={mainClass}>
        <div className={styles.top}>
          <h3>播放列表{}</h3>
          <div className={styles.top_right}>
            <ButtonInline onClick={this.handleClearlist}>
              <i className="fa fa-trash fa-2x" />
            </ButtonInline>
          </div>

        </div>
        {
          playList.map((item, i) => {
            return (
              <PlaylistItem
                performanceStore={performanceStore}
                store={playerStore}
                track={item}
                key={i + ' playlist item'}
              />
            )
          })
        }
      </div>
    );
  }
}

export default makeDumbProps(Playerlist);
