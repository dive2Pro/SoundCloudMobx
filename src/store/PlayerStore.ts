import { observable, action, computed } from 'mobx';
import { ITrack } from './TrackStore'
import { addAccessToken } from '../services/soundcloundApi'
export interface IPlayerStore {
  isPlaying: boolean
  playingTrack?: ITrack
  playList: ITrack[]
  setPlayingTrack: (track: ITrack) => void;
  togglePlaying: () => void;
  addToPlaylist: (track: ITrack) => void;
  playingUrl: string
}


class PlayerStore implements IPlayerStore {
  @observable playingTrack: ITrack
  @observable isPlaying: boolean = false;
  @observable playList: ITrack[];
  constructor() {

  }

  @action setPlayingTrack(track: ITrack) {
    this.playingTrack = track;
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
      let url = this.playingTrack.origin.stream_url;
      url = addAccessToken(url, '?');
      console.log(url)
      return url
    }
    return ""

  }
}

export default new PlayerStore();