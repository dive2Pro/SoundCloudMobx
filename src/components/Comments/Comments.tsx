import * as React from 'react'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import {observer, inject} from 'mobx-react'
import LoadingSpinner from '../LoadingSpinner'
import {specTimeTamp} from '../../services/utils'
import ArtWork from '../ArtWork'
import {HomeLink} from '../Links'
import {CommentStore, IComment} from '../../store/CommentStore';
import {TRACK_STORE, PERFORMANCE_STORE} from '../../constants/storeTypes';
import {ITrack} from '../../interfaces/interface';
import {PerformanceStore} from "../../store/PerformanceStore";
const styles = require('./comments.scss')
interface ICommentsProps {
    commentStore: CommentStore
    track: ITrack
    performanceStore?: PerformanceStore
}

const TYPE_COMMENTS = 'Comments';


interface ICommentViewProps {
    comment: IComment;
    performanceStore: PerformanceStore;
}

const CommentView = observer(({comment, performanceStore}: any) => {
    const {user: {id, avatar_url, username}, body, created_at} = comment;
    const artSize = performanceStore.isUnderHandsets
        ? 35 : performanceStore.isUnderMedium
            ? 50 : 75
    return (
        <div className={styles.comment}>
            <ArtWork
                size={artSize}
                src={avatar_url}
                clazz={styles.avatar}
            />
            <div className={styles.info}>
                <div className={styles.content}>
                    <HomeLink
                        id={id}
                    >
                        {username}
                    </HomeLink> :
                    <p>
                        {body}
                    </p>
                </div>
                <div className={styles.time}>
                    {specTimeTamp(created_at)}
                </div>
            </div>
        </div>
    )
})

@inject(TRACK_STORE, PERFORMANCE_STORE)
@observer
class Comments extends React.Component<ICommentsProps, any> {

    componentDidMount() {

        const {track, commentStore} = this.props
        // const { id } = track
        commentStore.setCurrentTrack(track);
        commentStore.fetchMoreComments();
    }

    render() {
        const performanceStore = this.props.performanceStore
        const {
            currentTrackComments: comments
            , isLoadingMoreComment
        } = this.props.commentStore
        return (
            <div style={{width: '100%'}}>
                {
                    comments.map((item, index) => {
                        return <CommentView
                            key={item.id + '-' + index} comment={item}
                            performanceStore={performanceStore}
                        />
                    })
                }
                <LoadingSpinner isLoading={isLoadingMoreComment}/>
            </div>
        );
    }
}

export default Hoc<ICommentsProps, any>(Comments, TYPE_COMMENTS);