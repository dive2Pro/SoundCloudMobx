import * as React from 'react'
import ButtonInline from '../ButtonInline';
import ArtWork from '../ArtWork';
import Permalink from '../Permalink';
import { observer, inject } from 'mobx-react'
import { ITrackStore } from '../../store/TrackStore'
import { IPlayerStore } from '../../store/PlayerStore'
import { ITrack, ICommentStore } from "../../store/index";
import { runInAction, observable } from ".3.1.7@mobx/lib/mobx";
import CommentsContainer from '../Comments'
const qs = require('qs')
const styles = require('./tracklistinfo.scss')


interface IPlaylistProps {
  TrackStore: ITrackStore
  PlayerStore: IPlayerStore
  CommentStore: ICommentStore
  match: any
  location: any
}


@inject("TrackStore", 'PlayerStore')
@observer
class Playlist extends React.Component<IPlaylistProps, any> {
  componentDidMount() {
    const { location: { search }, TrackStore } = this.props
    if (search) {
      const id = qs.parse(search.substr(1)).id

    } else {
    }

  }

  handlePlay = () => {
    const { PlayerStore, TrackStore } = this.props
    if (!PlayerStore || !TrackStore) {
      return;
    }
  }

  handleAddToPlaylist = () => {
    const { PlayerStore } = this.props
    if (!PlayerStore) {
      return;
    }
    PlayerStore.addToPlaylist(this.track)
  }
  handleFetchMoreComments = () => {
    this.props.CommentStore.fetchMoreComments();
  }
  render() {
    if (!this.track) {
      //Todo 
      return <noscript />
    }
    // const { activitiesCount, activities } = this.props.trackStore
    const { label_name, release_day, user, artwork_url } = this.track
    const { username, id, avatar_url } = user;
    return (
      <div className={styles.main}>
        <div className={styles.view}>
          <div className={styles.fhmm}>
            <ArtWork size={250} src={artwork_url} />
          </div>
          <div className={styles.infos}>
            <div className={styles.infos_title}>
              Song
            <h2>
                {label_name}
              </h2>
            </div>
            <div className={styles.infos_user}>
              <ArtWork src={avatar_url} size={50} />
              <span>
                <Permalink id={id} fullname={username} /></span>
              <span>{release_day}创建</span>
            </div>
            <div className={styles.infos_actions}>
              <div className={styles.infos_actions_plays}>
                <ButtonInline onClick={this.handlePlay}>播放</ButtonInline>
                <ButtonInline onClick={this.handleAddToPlaylist}><i>＋</i></ButtonInline>
              </div>
              <ButtonInline>
                <i className='fa fa-save'></i>
                收藏
              </ButtonInline>
              <ButtonInline>
                <i className='fa fa-share-square-o'></i>
                分享</ButtonInline>
              <ButtonInline>
                <i className='fa fa-comments'></i>
                评论</ButtonInline>
            </div>
          </div>
          <div className={styles.edit}>
            <i />
            <a href="#">编辑</a>
          </div>
        </div>

      </div>
    );
  }
}

export default Playlist;