import * as React from 'react'
import { observer } from 'mobx-react'
import { Action } from '../HoverActions'
import { ITrack } from "../../store/index";
import { Link } from 'react-router-dom'
const styles = require('./ttview.scss');
import * as sortTypes from '../../constants/sortTypes'

interface TdTrackTitleViewProp {
  track: ITrack
  sortType?: string
}
// let TdTrackTitleViewCount = 0

const TdTrackTitleView = observer(function TdTrackTitleView({ track, sortType }: TdTrackTitleViewProp) {
  const { user, title, playback_count, id,
    favoritings_count, comment_count, download_count } = track;
  const { username } = user
  const activeStyle = { color: '#14ff00' }
  // not over render
  // console.log('TdTrackTitleViewCount=' + TdTrackTitleViewCount++)
  return (
    <div className={styles.track_info}>
      <h5><Link to={{
        pathname: `/song`,
        search: `?id=${id}`
      }}>{title}</Link> - <span>{username}</span></h5>
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