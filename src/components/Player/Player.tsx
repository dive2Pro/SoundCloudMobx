import * as React from "react";

import { observer, inject } from "mobx-react";
import ButtonInline from "../ButtonInline";
import { IPlayerStore } from "../../store/PlayerStore";
import ArtWork from "../ArtWork";
import {
  action, observable, runInAction, autorun
  , when
} from "mobx";
// const mp3 = require('../../../public/assert/music.mp3')
const styles = require("./player.scss");
import Range from '../InputRange'
import { IPerformanceStore } from "../../store/index";

interface IPlayerProps {
  PlayerStore?: IPlayerStore
  PerformanceStore?: IPerformanceStore
}
interface IPlayerState {
  visible: boolean
}

@inject("PlayerStore", 'PerformanceStore')
@observer
class Player extends React.Component<IPlayerProps, IPlayerState> {
  blurredContentFrame: HTMLDivElement;
  scrollNode: any;
  fronsted_glass: HTMLDivElement;
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
    this.initGlassData();
  }

  renderPlayerOpearators = (store: IPlayerStore) => {
    const { isPlaying, playingTrack, isShuffleMode
      , volume
    } = store;

    let artworkUrl = "", trackName, username = "";
    if (playingTrack) {
      //todo es6的对象扩展
      const { artwork_url, title, user: { username: uname } } = playingTrack;
      artworkUrl = artwork_url;
      trackName = title;
      username = uname
    }
    const volumeContainerStyle = {
      ...this.volumeContainerStyle,
      // display: isVolumeOpen ? "block" : "none"
    }

    const shuffleClazz = isShuffleMode && styles.active;
    console.log('isPlaying = ' + isPlaying)
    return (
      <div
        className={styles.content}>
        {/*<input type="file" onChange={this.handleFiles} />*/}
        <div className={styles.content_name}>
          <div >
            <ArtWork clazz={styles.content_img} size={45} src={artworkUrl} />
          </div>
          <div className={styles.content_dur}>
            <span className={styles.trackName}>{trackName}</span>
            <span className={styles.author}>{username}</span>
          </div>
        </div>

        <div className={styles.content_plays}>
          <div className={shuffleClazz}>
            <ButtonInline onClick={this.handleShuffleMode}>
              <i className="fa fa-random">&nbsp;</i>
            </ButtonInline>
          </div>

          <div className={styles.content_action}>
            <ButtonInline onClick={() => this.handlePlayNext(-1)}>
              <i className="fa fa-step-backward">&nbsp;</i>
            </ButtonInline>
          </div>
          <div className={styles.content_action}>
            <ButtonInline onClick={() => store.togglePlaying()}>
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

        <div className={styles.content_options}>
          <div className={styles.content_action}>
            <ButtonInline onClick={this.handleOpenPlaylist}>
              <i className="fa fa-bars fa-2x">&nbsp;</i>
            </ButtonInline>
          </div>
          <div
            ref={n => this.volumeTag = n}
            className={styles.content_action}>
            <i
              style={{ width: '25px' }}
              className={`fa fa-volume-${volume > 0.5 ?
                "up" : volume == 0 ? 'off' : 'down'} fa-2x`}>&nbsp;</i>
            <div
              style={volumeContainerStyle}
              ref={n => this.volumeContainer = n}
              className={styles.volume_container}>
              <Range
                onDragEnd={this.handleVolimeProcessChange}
                onDragIng={this.handleVolimeProcessChange}
                wide={120}
                data={100}
                value={100 * volume}
                backgroundColor={'#9e9f9f'}
                defaultColor={'#b6bbbb'}
                contaiStyle={{ height: '7px' }}
                dotStyle={{
                  backgroundColor: 'white',
                  boxShadow: '0px 0px 2px 0px black'
                }}
              />
            </div>
          </div>


        </div>
      </div>
    )

  }
  renderPlayerRanges = (store: IPlayerStore) => {
    // const { playingTrack, isPlaying } = store
    const rangeClazz = styles.range;
    const value = this.file && (this.processValue * this.file.size).toFixed(1)

    return (
      <div>
        <div
          className={rangeClazz}>
          <Range
            onDragEnd={this.handleProcessChange}
            onDragIng={this.handleProcessChange}
            data={this.file && this.file.size}
            dotStyle={{ visibility: 'hidden' }}
            contaiStyle={{ height: '4px' }}
            backgroundColor={'#9e9f9f'}
            defaultColor={'#b6bbbb'}
            value={value} />
        </div>

      </div>)
  }

  /**
   * 同步更新 glass的偏移值
   */
  initGlassData = () => {
    if (0 == 0) {
      // return
    }
    const ps = this.props.PerformanceStore
    if (ps) {
      let node$: any;
      const main = this.main
      const glass = this.fronsted_glass
      const style = glass.style;
      const glassFrame = this.blurredContentFrame
      // let loadingAllSettle = false

      const resetNode$ = (glassNode: string, n: number) => {
        node$ = document.querySelector(`#${glassNode}`)
        node$ = node$.cloneNode(true);
        glass.innerHTML = '';
        glass.appendChild(node$);
        glassFrame.style.width = node$.offsetWidth + 'px';
        glassFrame.style.height = node$.offsetHeight + 'px';
        style.width = node$.offsetWidth + 'px';
        style.height = node$.offsetHeight + 'px';
        resetPositoin();
      }
      const resetPositoin = () => {
        if (node$) {
          // console.log('node$.offsetWidth = ' + node$.offsetWidth)
          const scrollY = ps.scrollY || 0;
          style.top = -(node$.offsetTop + main.offsetTop + scrollY) + 'px';
          // style.left = -(30) + "px"
          // console.log(style.top, main.offsetTop, node$.offsetTop, scrollY)
        }
      }

      const onceObservser = () => when(
        () => !ps.allLoadingIsSettle,
        () => {
          const handleObservaer = autorun(
            () => {
              if (ps.allLoadingIsSettle) {//当为true 即更新node //fuck 
                console.log('ps+ -------------')
                resetNode$(ps.glassNode, ps.scrollY)
                handleObservaer()
                onceObservser()
              }
            })
        })
      onceObservser();
      autorun(() => {
        const { glassNode } = ps
        if (!node$ || node$.id !== glassNode) {
          resetNode$(glassNode, ps.scrollY)
        }
        resetPositoin();
      })
    }
  }
  componentDidUpdate() {

    this.playMusic()
  }

  playMusic() {
    if (!this.props.PlayerStore) {
      return;
    }
    const { playingUrl, volume, isPlaying } = this.props.PlayerStore;
    const audio = this.audio
    if (isPlaying || audio.paused) {
      if (audio.src != playingUrl && playingUrl)
        audio.src = playingUrl;
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
    return (
      <div
        className={clazzName}
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseOut}
        ref={r => this.main = r}>
        <div
          ref={n => this.blurredContentFrame = n}
          className={styles.blurredContentFrame}>
          <div
            ref={n => this.fronsted_glass = n}
            className={styles.fronsted_glass}>
          </div>
        </div>
        {this.renderPlayerRanges(PlayerStore)}
        {this.renderPlayerOpearators(PlayerStore)}
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

export default Player 
