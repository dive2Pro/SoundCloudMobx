import * as React from 'react'
import ArtWork from '../ArtWork'
import { createTransformer } from 'mobx'
import TrackTitleView from '../TrackTitleView';
import HoverActions from '../HoverActions'
import { observer } from 'mobx-react'
import { ITrack, IPlayerStore } from "../../store/index";
import { transBigMath } from '../../services/utils'
const styles = require('./minitrack.scss')
interface IMiniTrackProps {
  PlayerStore: IPlayerStore
  track: ITrack
}
@observer
class MiniTrack extends React.Component<IMiniTrackProps, any> {
  transform = (track: ITrack) => {
    return createTransformer((track: ITrack) => {
      const { comment_count, download_count
        , playback_count, favoritings_count
      } = track

      return {
        ...track,
        comment_count: transBigMath(+comment_count),
        download_count: transBigMath(+download_count),
        playback_count: transBigMath(+playback_count),
        favoritings_count: transBigMath(+favoritings_count),
      }
    })(track)
  }
  render() {
    const { track, PlayerStore } = this.props
    const { isPlaying, playingTrack } = PlayerStore
    const { artwork_url } = track
    const isPlayingTrack = playingTrack === track
    const isTrackPlaying = isPlayingTrack && isPlaying
    const playClazz = isTrackPlaying ? 'fa fa-pause' : "fa fa-play"

    const configurations = [
      {
        fn: () => { PlayerStore.setPlayingTrack(track) },
        className: playClazz + " fa-2x"
      },
      {
        fn: () => { PlayerStore.addToPlaylist(track) },
        className: 'fa fa-folder-o fa-2x'
      }
    ]

    return (
      <div className={styles.mini}>
        <div className={styles.track}>
          <ArtWork src={artwork_url} size={62} />
          <TrackTitleView
            track={this.transform(track)} />
        </div>
        <div className={isPlayingTrack ? styles.visibleActions : styles.actions}>
          <HoverActions
            isVisible={isPlayingTrack}
            configurations={configurations} />
        </div>
      </div>
    );
  }
}

export default MiniTrack;