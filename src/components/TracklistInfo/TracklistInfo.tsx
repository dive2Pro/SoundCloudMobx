import * as React from 'react'
import ButtonInline from '../ButtonInline';
import ArtWork from '../ArtWork';
import Permalink from '../Permalink';
import { observer, inject } from 'mobx-react'
import { ITrackStore } from '../../store/TrackStore'
import { IPlayerStore } from '../../store/PlayerStore'
const styles = require('./tracklistinfo.scss')


interface ITracklistinfoViewProps {
  trackStore?: ITrackStore
  playerStore?: IPlayerStore
}


@inject("TrackStore", 'PlayerStore')
@observer
class TracklistinfoView extends React.Component<ITracklistinfoViewProps, any> {

  handlePlaylist = () => {
    const { playerStore, trackStore } = this.props
    if (!playerStore || !trackStore) {
      return;
    }
    //TODO playintlist
  }

  handleAddToPlaylist = () => {
    const { playerStore, trackStore } = this.props
    if (!playerStore || !trackStore) {
      return;
    }
    //TODO add to playinglist

  }
  render() {
    // const { activitiesCount, activities } = this.props.trackStore

    return (
      <div className={styles.view}>
        <div className={styles.fhmm}>
          <ArtWork size={250} src={'#'} />
        </div>
        <div className={styles.infos}>
          <div className={styles.infos_title}>
            歌单
            <h2>
              圣水寺{' '}
            </h2>
          </div>
          <div className={styles.infos_user}>
            <ArtWork src="#" size={50} />
            <span>
              <Permalink id={123123} fullname={'KKLEBO'} /></span>
            <span>2015-5-3创建</span>
          </div>
          <div className={styles.infos_actions}>
            <div className={styles.infos_actions_plays}>
              <ButtonInline onClick={this.handlePlaylist}>播放</ButtonInline>
              <ButtonInline onClick={this.handleAddToPlaylist}><i>＋</i></ButtonInline>
            </div>
            <ButtonInline>收藏</ButtonInline>
            <ButtonInline>分享</ButtonInline>
            <ButtonInline>评论</ButtonInline>
          </div>
        </div>

        <div className={styles.edit}>
          <i />
          <a href="#">编辑</a>
        </div>
      </div>
    );
  }
}

export default TracklistinfoView;