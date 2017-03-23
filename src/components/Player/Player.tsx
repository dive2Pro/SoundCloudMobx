import * as React from "react";
import * as CSSModule from "react-css-modules";
import { observer, inject } from "mobx-react";
import ButtonInline from "../ButtonInline";
import { IPlayerStore } from "../../store/PlayerStore";
import ArtWork from "../ArtWork";
import { action, observable } from "mobx";
const styles = require("./player.scss");
import Range from '../InputRange'
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
  @observable isVisible = false;
  @action setPlayerVisibleFromComponent(visible: boolean) {
    this.isVisible = visible;
  }

  mouseEnter = () => {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.setPlayerVisibleFromComponent(true);
  };
  mouseOut = (event: any) => {
    if (event.target.className !== "player__content") {
      return;
    }
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(
      () => {
        this.setPlayerVisibleFromComponent(false);
      },
      1500
    );
  };

  componentDidUpdate() {
    if (!this.props.PlayerStore) {
      return;
    }
    const { playingUrl, isPlaying } = this.props.PlayerStore;
    // const audio = this.audio
    if (playingUrl && isPlaying) {
      // console.log(playingUrl)
      // audio.src = playingUrl;
      // audio.play()
    }
  }
  handleOpenPlaylist = () => {
    const playStore = this.props.PlayerStore;
    if (playStore) playStore.togglePlaylistOpen();
  };
  handlePlayNext = (diff: number) => {
    const playStore = this.props.PlayerStore;
    if (playStore) playStore.playNextTrack(diff);
  };
  handleShuffleMode = () => {
    if (this.props.PlayerStore) {
      this.props.PlayerStore.toggleShuffleMode();
    }
  }
  render() {
    const { PlayerStore } = this.props;
    let clazzName = styles.base;
    if (this.isVisible) {
      clazzName = styles.visible;
    }
    if (!PlayerStore) {
      return <noscript />;
    }
    const { isPlaying, playingTrack, isShuffleMode } = PlayerStore;
    if (isPlaying) {
      clazzName = styles.visible;
    }
    let artworkUrl = "", trackName, username = "";
    if (playingTrack) {
      //todo es6的对象扩展
      const { artwork_url, title, user: { username: uname } } = playingTrack;
      artworkUrl = artwork_url;
      trackName = title;
      username = uname
    }
    const shuffleClazz = isShuffleMode && styles.active;
    const rangeClazz = playingTrack || isPlaying ? styles.range_visible : styles.range;
    return (
      <div
        className={clazzName}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseOut}
        ref={r => this.main = r}
      >
        <div className={rangeClazz}>
          <Range data={1234} value={244} />
        </div>
        <div className={styles.content}>
          <div className={styles.content_plays}>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => this.handlePlayNext(-1)}>
                <i className="fa fa-step-backward">&nbsp;</i>
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => PlayerStore.togglePlaying()}>
                <i className={`fa ${isPlaying ? "fa-pause" : "fa-play"}`} />
                &nbsp;
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline onClick={() => this.handlePlayNext(1)}>
                <i className="fa fa-step-forward">&nbsp;</i>
                &nbsp;
              </ButtonInline>
            </div>
          </div>
          <div className={styles.content_name}>
            <div className={styles.content_img}>
              <ArtWork size={35} src={artworkUrl} />
            </div>
            <div className={styles.content_dur}>
              <span>{trackName} - {username}</span>
            </div>
          </div>
          <div className={styles.content_options}>
            <div className={styles.content_action}>
              <ButtonInline>
                <i className="fa fa-volume-up">&nbsp;</i>

              </ButtonInline>
            </div>
            <div className={shuffleClazz}>
              <ButtonInline onClick={this.handleShuffleMode}>
                <i className="fa fa-random">&nbsp;</i>
              </ButtonInline>
            </div>
            <div className={styles.content_action}>
              <ButtonInline onClick={this.handleOpenPlaylist}>
                <i className="fa fa-bars">&nbsp;</i>
              </ButtonInline>
            </div>
          </div>
        </div>
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
