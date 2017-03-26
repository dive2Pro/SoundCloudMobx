import * as React from 'react'
import ArtWork from '../ArtWork'
import TrackTitleView from '../TrackTitleView';
import HoverActions from '../HoverActions'
import { observer } from 'mobx-react'
import { ITrack, IPlayerStore } from "../../store/index";
const styles = require('./minitrack.scss')
interface IMiniTrackProps {
  PlayerStore: IPlayerStore
  track: ITrack
}
@observer
class MiniTrack extends React.Component<IMiniTrackProps, any> {

  render() {
    const { track, PlayerStore } = this.props
    const { isPlaying, playingTrack } = PlayerStore
    const { artwork_url
      // , comment_count, download_count
      // , playback_count, favoritings_count
    } = track
    const isPlayingTrack = playingTrack === track
    const isTrackPlaying = isPlayingTrack && isPlaying
    const playClazz = isTrackPlaying ? 'fa-pause' : "fa-play"

    const configurations = [
      {
        fn: () => { PlayerStore.setPlayingTrack(track) },
        className: playClazz
      },
      {
        fn: () => { PlayerStore.addToPlaylist(track) },
        className: 'fa fa-folder-o'
      }
    ]

    return (
      <div className={styles.mini}>
        <div className={styles.track}>
          <ArtWork src={artwork_url} size={35} />
          <TrackTitleView track={track} />
        </div>
        <div>
          <HoverActions
            isVisible={isPlayingTrack}
            configurations={configurations} />
        </div>
      </div>
    );
  }
}

export default MiniTrack;