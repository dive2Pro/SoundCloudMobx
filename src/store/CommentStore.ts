import {
  ObservableMap, observable, computed, action, runInAction
  // , createTransformer
} from 'mobx'
import { apiUrl, unauthApiUrl } from '../services/soundcloundApi'
import { ITrack } from '../interfaces/interface';
import { performanceStore, sessionStore } from './index'
import { FETCH_COMMENTS } from '../constants/fetchTypes';
import { POST_TARCK_COMMENT } from '../constants/requestTypes';

import { RaceFetch as fetch } from '../services/Fetch'

export interface IComment {
  id: number,
  created_at: string,
  user_id: number,
  track_id: number,
  timestamp: number,
  body: string
  uri: string,
  user: {
    id: number,
    permalink: string,
    username: string,
    uri: string,
    permalink_url: string,
    avatar_url: string
  }
}



export class CommentStore {
  @observable currentTrack: ITrack
  @observable private nextHrefsByTrack = new ObservableMap<string>();
  private commentsByTracks = new ObservableMap<IComment[]>();

  constructor() {
    performanceStore.setLoadingStateWithKey(FETCH_COMMENTS, false)
    performanceStore.setLoadingStateWithKey(POST_TARCK_COMMENT, false)
  }
  transTrack(track: ITrack) {
    return { ...track, id: track.id + '' }
  }

  @computed get isLoadingMoreComment() {
    console.log('isLoadingMoreComment')
    return performanceStore.getLoadingStateWidthKey(FETCH_COMMENTS);
  }

  @action setCurrentTrack(track: ITrack) {
    this.currentTrack = (track);
    if (this.commentsCount < 1) {
      this.fetchMoreComments()
    }
  }
  @computed get commentsCount() {
    return this.currentTrackComments.length
  }
  @computed get currentTrackComments() {
    if (!this.currentTrack) { return []; }
    const data = this.commentsByTracks.get(this.currentTrack.id + '') || []
    return data
  }
  @computed get currentCommentNextHref(): string {
    return this.nextHrefsByTrack.get(this.currentTrack.id + '') || ''
  }

  setLoadingState(type: string, loading: boolean) {
    performanceStore.setLoadingStateWithKey(type, loading);
  }

  @action pushLastReplay(data) {
    this.currentTrackComments.unshift(data)
  }

  @action async fetchMoreComments(nextHref?: string) {
    if (this.isLoadingMoreComment) { return }
    nextHref = this.currentCommentNextHref
    if (nextHref == 'EMPTY') {
      return
    }
    const { id } = this.currentTrack
    const keyId = id + ''
    let url = nextHref
      ? nextHref : apiUrl(`tracks/${id}/comments?linked_partitioning=1&limit=50&offset=0`, '&');

    this.setLoadingState(FETCH_COMMENTS, true)

    try {
      const data: any = await fetch(url);
      const oldData = this.commentsByTracks.get(keyId)
      runInAction(() => {
        if (oldData) {
          oldData.push(...data.collection);
        } else {
          this.commentsByTracks.set(keyId, data.collection);
        }
        this.nextHrefsByTrack.set(keyId, data.next_href || 'EMPTY');
      })
    } catch (err) {
      performanceStore.catchErr(err, FETCH_COMMENTS)
    } finally {
      this.setLoadingState(FETCH_COMMENTS, false)
    }
  }

  // todo 用decortator来处理 try_catch  
  async submitReplay(id: number, msg: string) {
    const user = sessionStore.user
    if (!user) {
      return
    }
    const url = unauthApiUrl(`/tracks/${id}/comments`, '&')
    try {
      this.setLoadingState(POST_TARCK_COMMENT, true)
      // const data = await fetch(url, {
      // method: 'POST', 'Content-Type': `application/x-www-form-urlencoded; charset=UTF-8 `
      // })
      const data = await new Promise((resolve, reject) => {
        setTimeout(() => {
          const rawData = {
            kind: 'comment'
            , id: 341101782,
            created_at: '2017/04/13 16:23:38 +0000',
            user_id: 278227204,
            track_id: 280186218,
            timestamp: 450,
            body: `@huang-alex-635833920: ${msg}`,
            uri: 'https://api.soundcloud.com/comments/341101782',
            user: {
              id: 278227204
              , kind: 'user',
              permalink: 'huang-alex-635833920',
              username: 'Huang Alex',
              last_modified: '2017/03/31 08:35:22 +0000',
              uri: 'https://api.soundcloud.com/users/278227204',
              permalink_url: 'http://soundcloud.com/huang-alex-635833920',
              avatar_url: 'https://i1.sndcdn.com/avatars-000286355267-ibfmck-large.jpg'
            }
          }
          resolve(rawData)
        }, 500)
      })
      // console.log(data)
      this.pushLastReplay(data)
    } catch (err) {
      performanceStore.catchErr(err, POST_TARCK_COMMENT)
    } finally {
      this.setLoadingState(POST_TARCK_COMMENT, false)
    }

  }
}

export default new CommentStore();