import * as React from 'react'
import ArtWork from '../ArtWork'
import ButtonInline from '../ButtonInline'
import { observer, inject } from 'mobx-react'
import Permalink from '../Permalink'
import { ITrack, IPlayerStore } from '../../store/index';
import { IPlaylist } from '../../interfaces/interface';

const styles = require('./trackprofile.scss')
interface ITrackProfileProps {
  type: string
  bigPic: string
  label_name: string
  user: any
  track?: ITrack
  playlist?: IPlaylist
  PlayerStore?: IPlayerStore
}

@inject('PlayerStore')
@observer
class TrackProfile extends React.Component<ITrackProfileProps, any> {
  isTrack: boolean
  componentDidMount() {
    const { type } = this.props
    this.isTrack = type !== 'list'
  }
  handlePlay = () => {
    //  根据type
    const { track, playlist, PlayerStore } = this.props
    if (!PlayerStore) return
    if (this.isTrack && track) {
      PlayerStore.setPlayingTrack(track)
    } else if (playlist) {
      PlayerStore.addToPlaylist(playlist.tracks)
      PlayerStore.setPlayingTrack(playlist.tracks[0])
    }

  }

  handleAddToPlaylist = () => {
    const { track, playlist, PlayerStore } = this.props
    if (!PlayerStore) return
    if (this.isTrack && track) {
      PlayerStore.addToPlaylist(track)
    } else if (playlist) {
      PlayerStore.addToPlaylist(playlist.tracks)
    }

  }

  render() {
    const { type, bigPic, user, label_name } = this.props
    const isList = type === 'list';
    const { username, avatar_url, id } = user
    return (
      <div className={styles.view}>
        <div className={styles.fhmm}>
          <ArtWork size={250} src={bigPic} />
        </div>
        <div className={styles.infos}>
          <div className={styles.infos_title}>
            Song
            <h2>
              {label_name}
            </h2>
          </div>
          <div className={styles.infos_user}>
            <ArtWork src={avatar_url} size={50} />
            <span>
              <Permalink id={id} fullname={username} /></span>
            <span>{'release_day'}创建</span>
          </div>
          <div className={styles.infos_actions}>
            <div className={styles.infos_actions_plays}>
              <ButtonInline onClick={this.handlePlay}>播放</ButtonInline>
              <ButtonInline onClick={this.handleAddToPlaylist}><i>＋</i></ButtonInline>
            </div>
            <ButtonInline>
              <i className="fa fa-save" />
              收藏
              </ButtonInline>
            <ButtonInline>
              <i className="fa fa-share-square-o" />
              分享</ButtonInline>
            {
              !isList &&
              (<ButtonInline>
                <i className="fa fa-comments" />
                评论</ButtonInline>)
            }
          </div>
        </div>
        <div className={styles.edit}>
          <i />
          {/*<a href="#">编辑</a>*/}
        </div>
      </div>
    );
  }
}

export default TrackProfile;