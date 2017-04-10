import {
  ObservableMap, observable, computed, action, runInAction
  // , createTransformer
} from 'mobx'
import { apiUrl } from '../services/soundcloundApi'
import { ITrack } from "../interfaces/interface";

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
  @observable isLoading: boolean
  @observable private nextHrefsByTrack = new ObservableMap<string>();
  private commentsByTracks = new ObservableMap<IComment[]>();

  transTrack(track: ITrack) {
    return { ...track, id: track.id + '' }
  }

  @action setCurrentTrack(track: ITrack) {
    this.currentTrack = (track);
    if (this.commentsCount < 1)
    { this.fetchMoreComments() }
  }
  @computed get commentsCount() {
    return this.currentTrackComments.length
  }
  @computed get currentTrackComments() {
    if (!this.currentTrack) return [];
    const data = this.commentsByTracks.get(this.currentTrack.id + '') || []
    return data
  }
  @computed get currentCommentNextHref(): string {
    return this.nextHrefsByTrack.get(this.currentTrack.id + '') || ''
  }
  @action async fetchMoreComments(nextHref?: string) {
    if (this.isLoading) return
    nextHref = this.currentCommentNextHref;
    const { id } = this.currentTrack
    const keyId = id + ''

    let url = nextHref
      ? nextHref : apiUrl(`tracks/${id}/comments?linked_partitioning=1&limit=50&offset=0`, '&');
    this.isLoading = true
    const data: any = await fetch(url).then(response => response.json());
    runInAction(() => {
      const oldData = this.commentsByTracks.get(keyId)
      if (oldData) {
        oldData.push(...data.collection);
      } else {
        this.commentsByTracks.set(keyId, data.collection);
      }
      this.nextHrefsByTrack.set(keyId, data.next_href);
      this.isLoading = false;
    })
  }
}

export default new CommentStore();