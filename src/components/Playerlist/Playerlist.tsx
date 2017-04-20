import * as React from 'react';
import { inject, observer } from 'mobx-react';
import ButtonInline from '../ButtonInline';
import HoverActions from '../HoverActions'
const styles = require('./playerlist.scss');
import { StreamMain } from '../Stream'
import { ITrack } from '../../interfaces/interface';
import { PlayerStore } from '../../store/PlayerStore';
import { PLAYER_STORE } from '../../constants/storeTypes';
import makeDumbProps from '../../Hoc/makeDumbProps';

interface IPlaylistProp {
  playerStore: PlayerStore
}
interface IPlaylistItemProp {
  track: ITrack
  store: PlayerStore
}

const PlaylistItem = observer(({ track, store }: IPlaylistItemProp) => {
  const { playingTrack } = store
  const isPlaying = playingTrack ? playingTrack.id === track.id : false;
  const isHidden = !playingTrack || playingTrack.id !== track.id;

  // const itemIsplaying = isPlaying && playingTrack === item
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

  return (
    <div className={styles.playlistitem}>
      <StreamMain
        track={track}
        store={store}
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


@inject(PLAYER_STORE)
@observer
class Playerlist extends React.Component<IPlaylistProp, any> {


  handleClearlist = () => {
    const playerStore = this.props.playerStore;
    playerStore.clearPlaylist();
  };

  render() {
    const { playerStore } = this.props;

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
