import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import { observer, inject } from 'mobx-react'
import ButtonInline from '../ButtonInline';
import { IPlayerStore } from '../../store/PlayerStore'
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
  player: any;
  audio: HTMLAudioElement;
  state = { visible: false }
  mouseEnter = () => {
    this.setState({
      visible: true
    });
  };
  mouseOut = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.setState({
        visible: false
      });
    }, 1500
    );
  };

  componentDidUpdate() {
    if (!this.props.PlayerStore) {
      return
    }
    const { playingUrl, isPlaying } = this.props.PlayerStore
    const audio = this.audio
    if (playingUrl && isPlaying) {
      console.log(playingUrl)
      audio.src = playingUrl;
      audio.play()
    }
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
    const { isPlaying } = PlayerStore

    return (
      <div
        className={clazzName}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseOut}
        ref={r => this.player = r}>
        <div className={styles.content}>
          <div className={styles.content_plays}>
            <div className={styles.content_action}>
              <ButtonInline>
                <i className="fa fa-step-backward">&nbsp;</i>
                {'|<'}
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => PlayerStore.togglePlaying()}>
                <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'}`} />
                &gt;
                </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline >
                <i className="fa fa-step-forward">&nbsp;</i>
                &gt;|{' '}
              </ButtonInline>
            </div>
          </div>
          <div className={styles.content_name}>

          </div>
          <div className={styles.content_options}>
            <div className={styles.content_action}>
              <ButtonInline>
                <i className="fa fa-step-backward">&nbsp;</i>
                {'|<>'}
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline  >
                {'<>'}
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline  >
                <i className="fa fa-step-forward">&nbsp;</i>
                &gt;|{'== '}
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