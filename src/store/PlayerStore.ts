import { observable, action, computed } from 'mobx';
import { ITrack } from './TrackStore'
import { addAccessToken } from '../services/soundcloundApi'
export interface IPlayerStore {
  isPlaying: boolean
  playingTrack: ITrack
  playList: ITrack[]
  setPlayingTrack: (track: ITrack | number) => void;
  togglePlaying: () => void;
  addToPlaylist: (track: ITrack) => void;
  playingUrl: string
  playNextTrack: (diff: number) => boolean
}


class PlayerStore implements IPlayerStore {
  @observable playingTrack: ITrack
  @observable isPlaying: boolean = false;
  @observable playList: ITrack[] = [];
  constructor() {

  }

  @action setPlayingTrack(track: ITrack | number) {
    if (typeof track === 'number') {
      track = this.playList[track];
    }
    this.playingTrack = track;
    this.addToPlaylist(track);
    this.isPlaying = true;
  }

  @action togglePlaying() {
    this.isPlaying = !this.isPlaying;
  }

  @action addToPlaylist(track: ITrack) {
    if (this.playList.indexOf(track) === -1) {
      this.playList.push(track)
    }
  }

  @computed get getPlaylistCount() {
    return this.playList && this.playList.length;
  }
  @computed get playingUrl() {
    if (this.playingTrack) {
      let url = this.playingTrack.stream_url;
      url = addAccessToken(url, '?');
      console.log(url)
      return url
    }
    return ""
  }
  @action playNextTrack(diff: number): boolean {
    if (this.getPlaylistCount < 1) {
      return false;
    }
    let changedIndex = 0;
    if (this.playingTrack) {
      changedIndex = this.playList.indexOf(this.playingTrack) + diff;
    }
    this.setPlayingTrack(this.playList[changedIndex]);
    return true;
  }
}

export default new PlayerStore();