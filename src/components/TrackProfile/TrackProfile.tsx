import * as React from 'react'
import ButtonInline from '../ButtonInline'
import {inject, observer} from 'mobx-react'
import {IPlaylist, ITrack} from '../../interfaces/interface';
import {PlayerStore} from '../../store/PlayerStore';
import {getSpecPicPath, PicSize} from '../../services/soundcloundApi'
import colorThief from '../../services/ColorThief'
const preImage = require('../../../public/images/preload.jpg')
import {HomeLink} from '../Links'
import {PERFORMANCE_STORE} from "../../constants/storeTypes";
import {PerformanceStore} from "../../store/PerformanceStore";
const isEqual = require('lodash/isEqual')

const styles = require('./trackprofile.scss')

interface ITrackProfileProps {
    type: string
    bigPic: string
    label_name: string
    user: any
    track?: ITrack
    playlist?: IPlaylist
    playerStore: PlayerStore
    performanceStore?:PerformanceStore
}
@inject(PERFORMANCE_STORE)
@observer
class TrackProfile extends React.Component<ITrackProfileProps, any> {
    isTrack: boolean
    palettes: any[][]
    renderBackgroundGradient = () => {
        if (!this.palettes || this.palettes.length < 2) {
            return (
                <div className={styles.backgroundGradient}>
                    <div className={styles.backgroundGradient_buffer}/>
                    <div className={styles.backgroundGradient_hidden}/>
                </div>
            )
        }
        const [a, b, c, d] = this.palettes
        const [a1, a2, a3] = a
        const [b1, b2, b3] = b
        const [c1, c2, c3] = c
        const [d1, d2, d3] = d
        const b1Clazz = {
            background: `linear-gradient(45deg,rgb(${a1},${a2},${a3}) 0%,rgb(${b1}, ${b2},${b3}) 100%`
        }
        const b2Clazz = {
            background: `linear-gradient(45deg,rgb(${c1},${c2},${c3}) 0%,rgb(${d1}, ${d2},${d3}) 100%`
        }
        const {performanceStore} = this.props
        if(performanceStore){
            performanceStore.setTrackPalettesBackground(b2Clazz.background);
        }
        return (
            <div className={styles.backgroundGradient}>
                <div className={styles.backgroundGradient_buffer} style={b1Clazz}/>
                <div className={styles.backgroundGradient_hidden} style={b2Clazz}/>
            </div>
        )
    }

    componentDidMount() {
        const {type, bigPic} = this.props
        this.isTrack = type !== 'list'
        Promise.resolve(bigPic)
            .then(source => {
                const pic = getSpecPicPath(bigPic, PicSize.MASTER)
                colorThief.getColorFromUrl(pic, (palettes, url) => {
                    this.palettes = palettes
                    this.forceUpdate()
                })
            })

    }

    handlePlay = () => {
        //  根据type
        const {track, playlist, playerStore} = this.props
        if (this.isTrack && track) {
            playerStore.setPlayingTrack(track)
        } else if (playlist) {
            playerStore.addToPlaylist(playlist.tracks)
            playerStore.setPlayingTrack(playlist.tracks[0])
        }

    }


    render() {
        const {bigPic, user, label_name, playerStore, track} = this.props
        const {username, id} = user
        let isCurrentTrackPlaying = false;
        isCurrentTrackPlaying = playerStore.isPlaying
            && isEqual(playerStore.playingTrack, track)

        return (
            <div
                className={styles.view}
            >
                {this.renderBackgroundGradient()}
                <div
                    className={styles.infos}
                >
                    <div className={styles.artwork_wrapper}>
                            <span
                                className={styles.artwork}
                                style={{
                                    backgroundImage: `url(${bigPic ? getSpecPicPath(bigPic, PicSize.MASTER) : preImage})`
                                }}
                            />
                    </div>
                    <div className={styles.artwork_infos}>
                        <ButtonInline
                            className={styles.infos_actions_play}
                            onClick={this.handlePlay}
                        >
                            <i
                                className={`fa fa-${isCurrentTrackPlaying ? 'pause fa-2x' : 'play fa-3x'}`}
                            />
                        </ButtonInline>
                        <div
                            className={styles.infos_operators}
                        >
                            <div className={styles.infos_title}>

                                <HomeLink
                                    id={id}
                                    clazz={styles.userlink}
                                >
                                    {username}
                                </HomeLink>
                                <h1>
                                    {track ? track.title : label_name}
                                </h1>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

export default TrackProfile;