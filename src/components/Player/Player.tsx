import * as React from 'react';
import {observer, inject} from 'mobx-react';
import ButtonInline from '../ButtonInline';
import {PlayerStore} from '../../store/PlayerStore';
import ArtWork from '../ArtWork';
import {
    action, observable, runInAction, autorun
    , when
} from 'mobx';
const styles = require('./player.scss');
import Range from '../InputRange'
import {PLAYER_STORE, PERFORMANCE_STORE} from '../../constants/storeTypes';
import {PerformanceStore} from '../../store/PerformanceStore';
import makeDumbProps from '../../Hoc/makeDumbProps';
import {StreamLink,UserLink} from '../Links'

interface IPlayerProps {
    playerStore: PlayerStore
    performanceStore: PerformanceStore
}
interface IPlayerState {
    visible: boolean
}

@inject(PLAYER_STORE, PERFORMANCE_STORE)
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
    playerContainer: HTMLDivElement
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
        if (event.target.className !== 'player__content') {
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
            // this.volumeContainerStyle = vcStyle
        })

        this.initGlassData();
        this.playNextTrack()
        this.updateWithVolumeAndPlay()

    }


    playNextTrack = () => {
        const {playerStore} = this.props

        this.playNextTrack = autorun(() => {

            if (this.processValue == 1
                && playerStore
                && !playerStore.isShuffleMode) {
                this.setProcessValue(0);
                const hasPlayed = playerStore.playNextTrack(1);
                if (!hasPlayed) {
                    playerStore.togglePlaying();
                }
            }
        })
    }

    handleVolumeOpen = () => {
        const {
            performanceStore: pstore,
            playerStore
        } = this.props

        if (pstore.isUnderMedium) {
            playerStore.toggleVolumeOpen();
        }
    }
    renderPlayerOpearators = (store: PlayerStore) => {
        const {
            isPlaying, playingTrack, isShuffleMode
            , volume
        } = store;

        let artworkUrl = '', trackName, username = '',trackId=0,userId=0;
        if (playingTrack) {
             const {artwork_url, title, id,user: {username: uname,id:uId}} = playingTrack;
            artworkUrl = artwork_url;
            trackName = title;
            username = uname;
            trackId=id;
            userId=uId
        }
        const volumeContainerStyle = {
            ...this.volumeContainerStyle,
        }

        const shuffleClazz = isShuffleMode && styles.active;
        const pstore = this.props.performanceStore
        const isUnderMediumFa = pstore.isUnderMedium?"fa-2x":"fa-2x"
        return (
            <div
                ref={n => this.playerContainer = n}
                className={styles.content}>

                <div className={styles.content_name}>
                    <div >
                        <ArtWork
                            clazz={styles.content_img}
                            size={45}
                            src={artworkUrl}
                            live={true}
                        />

                    </div>
                    <div className={styles.content_dur}>
                        <StreamLink
                            className={styles.trackName}
                            id={trackId}
                        >
                            {trackName}
                        </StreamLink>

                        <UserLink
                            className={styles.author}
                            path=""
                            id={userId}
                        >
                            {username}
                        </UserLink>
                    </div>
                </div>

                <div className={styles.content_plays}>
                    <div
                        alt={'random track'}
                        className={shuffleClazz}>
                        <ButtonInline onClick={this.handleShuffleMode}>
                            <i className={`fa fa-random ${isUnderMediumFa}`}>&nbsp;</i>
                        </ButtonInline>
                    </div>

                    <div
                        alt={'next Stream'}
                        className={styles.content_action}>
                        <ButtonInline onClick={() => this.handlePlayNext(-1)}>
                            <i className={`fa fa-backward ${isUnderMediumFa}`}>&nbsp;</i>
                        </ButtonInline>
                    </div>
                    <div className={styles.content_action}>
                        <ButtonInline onClick={() => store.togglePlaying()}>
                            <i className={`fa ${isPlaying ? 'fa-pause' : 'fa-play'} ${isUnderMediumFa}`}/>
                            &nbsp;
                        </ButtonInline>
                    </div>
                    <div className={styles.content_action}>
                        <ButtonInline onClick={() => this.handlePlayNext(1)}>
                            <i className={`fa fa-step-forward ${isUnderMediumFa}`}>&nbsp;</i>
                            &nbsp;
                        </ButtonInline>
                    </div>
                </div>

                <div className={styles.content_options}>
                    <div className={styles.content_action}>
                        <ButtonInline onClick={this.handleOpenPlaylist}>
                            <i className={`fa fa-bars fa-2x`}>&nbsp; </i>
                        </ButtonInline>
                    </div>
                    <div
                        ref={n => this.volumeTag = n}
                        className={styles.content_action}>
                        <em
                            onClick={this.handleVolumeOpen}
                            style={{width: '25px',marginRight:'5px'}}
                            className={`fa fa-volume-${volume > 0.5 ?
                                'up' : volume == 0 ? 'off' : 'down'} fa-2x`}>&nbsp;</em>
                        <div
                            style={{display:pstore.isUnderMedium?store.isVolumeOpen?"block":"none":'block'}}
                            ref={n => this.volumeContainer = n}
                            className={styles.volume_container}
                        >
                            {
                                (pstore.isUnderMedium
                                &&!store.isVolumeOpen)
                                || (
                                    <Range
                                        onDragEnd={this.handleVolimeProcessChange}
                                        onDragIng={this.handleVolimeProcessChange}
                                        wide={120}
                                        data={100}
                                        value={100 * volume}
                                        backgroundColor={'#f55874'}
                                        defaultColor={'#b6bbbb'}
                                        vertical={pstore.isUnderMedium}
                                        dotStyle={{
                                            backgroundColor: 'white',
                                            boxShadow: '0px 0px 2px 0px black'
                                        }}
                                    />
                                )
                            }
                        </div>
                    </div>


                </div>
            </div>
        )
    }

    renderPlayerRanges = (store: PlayerStore) => {
        const {
            playingTrack
        } = store
        const rangeClazz = styles.range;
        const duration = playingTrack ? playingTrack.duration : 0
        const {performanceStore}  =this.props

        return (
            <div
                className={`${rangeClazz}`}
            >
                <Range
                    onDragEnd={this.handleProcessChange}
                    onDragIng={this.handleProcessChange}
                    data={playingTrack && playingTrack.duration}
                    dotStyle={{width:12,height:12}}
                    contaiStyle={{height: '4px'}}
                    defaultColor={'#b6bbbb'}
                    value={this.processValue * duration}/>
            </div>
        )
    }

    /**
     * 同步更新 glass的偏移值
     */

    initGlassData = () => {

        const ps = this.props.performanceStore
        let node$: any;
        const main = this.main
        const glass = this.fronsted_glass
        const style = glass.style;
        const glassFrame = this.blurredContentFrame
        const resetPositoin = () => {
            if (node$) {
                const scrollY = ps.scrollY || 0;
                style.top = -(node$.offsetTop + main.offsetTop + scrollY) + 'px';
            }
        }

        const resetNode$ = (glassNode: string, n: number) => {
            node$ = document.querySelector(`#${glassNode}`)
            if (!node$) {
                return
            }
            node$ = node$.cloneNode(true);
            // main.style.left = -node$.offsetLeft + "px"
            glass.innerHTML = '';
            glass.appendChild(node$);
            glassFrame.style.width = node$.offsetWidth + 'px';
            glassFrame.style.height = node$.offsetHeight + 'px';
            node$.style.left = '0px';
            node$.style.margin = '0px';

            style.width = 100 + 'vw';
            style.height = node$.offsetHeight + 'px';
            resetPositoin();
        }


        const onceObservser = () => when(
            () => !ps.allLoadingIsSettle,
            () => {
                const handleObservaer = autorun(
                    () => {
                        // 当为true 即更新node //fuck
                        if (ps.allLoadingIsSettle) {
                            resetNode$(ps.glassNode, ps.scrollY)
                            handleObservaer()
                            onceObservser()
                        }
                    })
            })
        onceObservser();
        this.initGlassData = autorun(() => {
            const {glassNode} = ps
            if (!node$ || node$.id !== glassNode) {
                resetNode$(glassNode, ps.scrollY)
            }
            resetPositoin();
        })
    }

    // 取消autoruns
    componentWillUnMount() {
        this.initGlassData();
        this.playNextTrack()
        this.updateWithVolumeAndPlay()

    }

    updateWithVolumeAndPlay() {
        this.updateWithVolumeAndPlay = autorun(() => {

            const {volume, isPlaying} = this.props.playerStore;
            const audio = this.audio
            if (isPlaying) {
                const {playingUrl} = this.props.playerStore
                if (audio.src !== (playingUrl)) {
                    audio.src = playingUrl;
                }
                audio.play()
            } else {
                if (!audio.paused) {
                    audio.pause();
                }
            }
            audio.volume = volume;
        })
    }

    handleOpenPlaylist = () => {
        const playStore = this.props.playerStore;
        playStore.togglePlaylistOpen()
    };

    handlePlayNext = (diff: number) => {
        const playStore = this.props.playerStore;
        playStore.playNextTrack(diff);

    };

    handleShuffleMode = () => {
        this.props.playerStore.toggleShuffleMode();

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
        this.setProcessValue(currentTime / duration);
    }

    @action setProcessValue(value: number) {
        this.processValue = value
    }

    handleVolimeProcessChange = (percent: string) => {
        const p = this.props.playerStore

        p.setVolume(+percent)

    }

    render() {
        const {playerStore,performanceStore} = this.props;
        let clazzName = styles.base;

        if (this.isVisible) {
            clazzName = styles.player_visible;
        }

        const backgroundColor = performanceStore.trackPalatteColor;
        return (
            <div
                className={clazzName}
                onMouseEnter={this.mouseEnter}
                onMouseLeave={this.mouseOut}
                style={{background:backgroundColor}}
                ref={r => this.main = r}
            >
                <div
                    ref={n => this.blurredContentFrame = n}
                    className={styles.blurredContentFrame}
                >
                    <div
                        ref={n => this.fronsted_glass = n}
                        className={styles.fronsted_glass}
                    />
                </div>
                {this.renderPlayerRanges(playerStore)}
                {this.renderPlayerOpearators(playerStore)}
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


export default makeDumbProps(Player)
