import * as React from 'react'
const styles = require('./activities.scss')
import {observer, inject} from 'mobx-react';
import {ITrack} from '../../interfaces/interface';
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import Stream from '../Stream'
import {PlayerStore} from '../../store/PlayerStore';
import {PLAYER_STORE} from '../../constants/storeTypes';
import makeLoadingSpinner from '../../Hoc/makeLoadingSpiner'
import makeBackToTop from '../../Hoc/makeBackToTop'
import {IAddtionalProps} from '../../Hoc/makeOpacityTransition'

interface IActivitiesProps extends IAddtionalProps {
    playerStore?: PlayerStore
    isLoading: boolean,
    datas: ITrack[],
    type: string
    isError?: boolean,
    streamStyle?: any
}

@inject(PLAYER_STORE)
@observer
class Activities extends React.Component<IActivitiesProps, {}> {
    addToTrackList = (track: ITrack) => {
        const {playerStore} = this.props
        if (playerStore) {
            playerStore.addToPlaylist(track);
        }
    }

    render() {
        const {
            datas,
            type,
            playerStore: store
            , interpolatedStyles
        } = this.props;

        if (!store || !datas) {
            return <noscript />
        }
        const isinterpolatedStyles = !!interpolatedStyles
        const items: any = isinterpolatedStyles ? interpolatedStyles : datas
        return (
            <div className={styles.tracks}>
                {
                    items.map((item, i) => {
                        const style: any = isinterpolatedStyles ? (item.style || item) : {}
                        const track: any = isinterpolatedStyles ? (item.data || datas[i]) : item;
                        const key = isinterpolatedStyles ? item.key + track.id : track.id;
                        return (
                            <div
                                key={key + '-' + i}
                                style={{
                                    ...style, left: `${style.left}`
                                }}>
                                <Stream
                                    type={type}
                                    track={track}
                                    i={i + 1}
                                    store={store}
                                    {...this.props.streamStyle}
                                />
                            </div>
                        )
                    }) }
            </div>
        );
    }
}


// let  ActivitiesCount = 0
// 这里不需要传入 type,因为已经在 TrackStore中setGenre的时候设置了
export default
    Hoc(
        makeLoadingSpinner(
            // makeTranslateXMotionWrapper(
            Activities
        )
        // , styles.main
    // )
)
