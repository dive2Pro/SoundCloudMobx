import * as React from 'react'
import { observer } from 'mobx-react'
import { Action } from '../HoverActions'
import { ITrack } from "../../store/index";
const styles = require('./ttview.scss');
import * as sortTypes from '../../constants/sortTypes'

interface TdTrackTitleViewProp {
  track: ITrack
  sortType?: string
}

const TdTrackTitleView = observer(({ track, sortType }: TdTrackTitleViewProp) => {
  const { user, title, playback_count, favoritings_count, comment_count, download_count } = track;
  const { username } = user
  const activeStyle = { color: '#14ff00' }

  return (
    <div className={styles.track_info}>
      <h5><span>{title}</span> - <span>{username}</span></h5>
      <div className={styles.track_counts}>
        <Action
          activeStyle={sortType == sortTypes.SORT_PLAYBACK_COUNT ? activeStyle : {}}
          className='fa fa-play'
          children={playback_count}
        />
        <Action
          activeStyle={sortType == sortTypes.SORT_FAVORITINGS_COUNT ? activeStyle : {}}
          className='fa fa-likes'
          children={favoritings_count} />
        <Action
          activeStyle={sortType == sortTypes.SORT_COMMENT_COUNT ? activeStyle : {}}
          className='fa fa-comment'
          children={comment_count} />

        <Action
          activeStyle={sortType == sortTypes.SORT_DOWNLOAD_COUNT ? activeStyle : {}}
          className='fa fa-download'
          children={download_count} />
      </div>
    </div>
  )
})
export default TdTrackTitleView