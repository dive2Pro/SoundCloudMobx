import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import { observer, inject } from 'mobx-react'
import ButtonInline from '../ButtonInline';
import { IPlayerStore } from '../../store/PlayerStore'
import ArtWork from '../ArtWork'
const styles = require('./player.scss')

interface IPlayerProps {
  PlayerStore?: IPlayerStore
}
interface IPlayerState {
  visible: boolean
}

@inject("PlayerStore")
@observer
class Player extends React.Component<IPlayerProps, IPlayerState> {
  timer: any;
  main: any;
  audio: HTMLAudioElement;
  state = { visible: false }
  mouseEnter = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setState({
      visible: true
    });
  };
  mouseOut = (event: any) => {
    if (event.target.className !== 'player__content') {
      return
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.setState({
        visible: false
      });
    }, 1500);
  };

  componentDidUpdate() {
    if (!this.props.PlayerStore) {
      return
    }
    const { playingUrl, isPlaying } = this.props.PlayerStore
    // const audio = this.audio
    if (playingUrl && isPlaying) {
      // console.log(playingUrl)
      // audio.src = playingUrl;
      // audio.play()
    }
  }

  handlePlayNext = (diff: number) => {
    const playStore = this.props.PlayerStore
    if (playStore)
      playStore.playNextTrack(diff);

  }

  render() {

    const { visible } = this.state;
    const { PlayerStore } = this.props;
    let clazzName = styles.base;
    if (visible) {
      clazzName = styles.visible;
    }
    if (!PlayerStore) {
      return <noscript />
    }
    const { isPlaying, playingTrack } = PlayerStore
    if (isPlaying) {
      clazzName = styles.visible;
    }
    let artworkUrl = "", trackName
    if (playingTrack) {
      //todo es6的对象扩展
      const { artwork_url, title } = playingTrack
      artworkUrl = artwork_url;
      trackName = title
    }
    return (
      <div
        className={clazzName}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseOut}
        ref={r => this.main = r}>
        <div className={styles.content}>
          <div className={styles.content_plays}>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => this.handlePlayNext(-1)}>
                <i className="fa fa-step-backward">&nbsp;</i>
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => PlayerStore.togglePlaying()}>
                <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                &nbsp;
                </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => this.handlePlayNext(1)} >
                <i className="fa fa-step-forward">&nbsp;</i>
                &nbsp;
              </ButtonInline>
            </div>
          </div>
          <div className={styles.content_name}>
            <ArtWork size={50} src={artworkUrl} />
            <span>{trackName}</span>
          </div>
          <div className={styles.content_options}>
            <div className={styles.content_action}>
              <ButtonInline>
                <i className="fa fa-volume-up">&nbsp;</i>

              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline>
                <i className="fa fa-random">&nbsp;</i>

              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline  >
                <i className="fa fa-bars">&nbsp;</i>
              </ButtonInline>
            </div>
          </div>
        </div>
        <div className="hand" />
        <audio
          ref={(audio: HTMLAudioElement) => {
            this.audio = audio;
          }}
          id="audio"
        />
      </div>
    );
  }
}

export default CSSModule(Player, styles);