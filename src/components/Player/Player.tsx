import * as React from "react";
import * as CSSModule from "react-css-modules";
import { observer, inject } from "mobx-react";
import ButtonInline from "../ButtonInline";
import { IPlayerStore } from "../../store/PlayerStore";
import ArtWork from "../ArtWork";
import { action, observable, runInAction } from "mobx";
const mp3 = require('../../../public/assert/music.mp3')
console.log(mp3)
// const b = new File(mp3, 'mp3');

// console.info(b)

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
  volumeContainerStyle: { left: number; };
  volumeContainer: HTMLDivElement;
  volumeTag: HTMLDivElement;
  timer: any;
  main: any;
  audio: HTMLAudioElement;
  @observable isVisible = false;
  @observable processValue = 0;
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
  componentDidMount() {
    const vc = this.volumeContainer
    const vt = this.volumeTag
    const vol = vt.offsetLeft
    const vcStyle = {
      left: vol - vc.offsetWidth / 2
    }
    runInAction(() => {
      this.volumeContainerStyle = vcStyle
    })
  }
  componentDidUpdate() {
    if (!this.props.PlayerStore) {
      return;
    }
    const {
      // playingUrl,
      volume,
      isPlaying } = this.props.PlayerStore;
    const audio = this.audio
    if (
      // playingUrl &&
      isPlaying && audio.paused) {
      audio.src = mp3;
      audio.play()
    } else if (!isPlaying) {
      audio.pause();
    }
    audio.volume = volume;
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
  // 😱 😱 will be remove  just for test
  @observable file: any;
  handleFiles = (e: any) => {
    runInAction(() => {
      this.file = (e.target.files[0]);
    })
  }
  handleProcessChange = (value: string) => {
    // debugger 
    const dru = this.audio.duration || 1;
    const current = dru * (+value)
    this.audio.currentTime = current;
  }

  // 监听播放进度,更新Iupet进度
  // todo 其实可以传入一个mobx的值进行响应式
  handleAudioUpdate = (e: any) => {
    // debugger
    const t = e.target;
    const duration = t.duration
    const currentTime = t.currentTime
    runInAction(() => {
      this.processValue = currentTime / duration

    })
  }
  handleVolimeProcessChange = (percent: string) => {
    const p = this.props.PlayerStore
    if (p) {
      p.setVolume(+percent)
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
    const { isPlaying, isPlaylistOpen, playingTrack, isShuffleMode
      // , playingUrl
      , isVolumeOpen, volume
    } = PlayerStore;
    if (isPlaying || isPlaylistOpen) {
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
    const value = this.file && (this.processValue * this.file.size).toFixed(1)
    const volumeContainerStyle = { ...this.volumeContainerStyle, display: isVolumeOpen ? "block" : "none" }
    return (
      <div
        className={clazzName}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseOut}
        ref={r => this.main = r}
      >
        <div
          className={rangeClazz}>
          <Range
            onDragEnd={this.handleProcessChange}
            onDragIng={this.handleProcessChange}
            data={this.file && this.file.size}
            value={value} />
        </div>
        <div
          style={volumeContainerStyle}
          ref={n => this.volumeContainer = n}
          className={styles.volume_container}>
          <Range
            onDragEnd={this.handleVolimeProcessChange}
            onDragIng={this.handleVolimeProcessChange}
            vertical
            wide={120}
            data={100}
            value={100 * volume}
          />
        </div>
        <div className={styles.content}>
          <input type="file" onChange={this.handleFiles} />
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
            <div
              ref={n => this.volumeTag = n}
              className={styles.content_action}>
              <ButtonInline onClick={() => PlayerStore.toggleVolumeOpen()}>
                <i className={`fa fa-volume-${volume > 0.5 ? "up" : volume == 0 ? 'off' : 'down'}`}>&nbsp;</i>
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
          onTimeUpdate={this.handleAudioUpdate}
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
