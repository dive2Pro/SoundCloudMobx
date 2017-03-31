import { observable, action, computed } from 'mobx';
import { ITrack } from './TrackStore'
import { addAccessToken } from '../services/soundcloundApi'
interface Lambda {
  (): void;
}
export interface IPlayerStore {
  isPlaying: boolean
  playingTrack: ITrack
  playList: ITrack[]
  setPlayingTrack: (track: ITrack | number) => void;
  togglePlaying: Lambda;
  addToPlaylist: (track: ITrack | ITrack[]) => void;
  playingUrl: string
  playNextTrack: (diff: number) => boolean
  isPlaylistOpen: boolean
  togglePlaylistOpen: (open?: boolean) => void;
  toggleVolumeOpen: (open?: boolean) => void;
  removeFromPlaylist: (...args: ITrack[]) => void;
  clearPlaylist: Lambda;
  toggleShuffleMode: Lambda;
  isShuffleMode: boolean
  isVolumeOpen: boolean
  volume: number

  setVolume: (n: number) => void
}


class PlayerStore implements IPlayerStore {
  @observable playingTrack: ITrack
  @observable isPlaying: boolean = false;
  @observable playList: ITrack[] = [];
  @observable isPlaylistOpen: boolean = false;
  @observable isShuffleMode: boolean = false;
  @observable isVolumeOpen: boolean = false
  @observable volume: number = 0.25
  constructor() {
  }
  @action setVolume(v: number) {
    this.volume = v;
  }
  @action setPlayingTrack(track: ITrack | number) {
    if (typeof track === 'number') {
      track = this.playList[track];
    }
    if (this.playingTrack === track && this.isPlaying) {
      this.isPlaying = false;
    } else {
      this.playingTrack = track;
      this.isPlaying = true;
    }
    this.addToPlaylist(track);
  }

  @action togglePlaying() {
    this.isPlaying = !this.isPlaying;
  }
  @action toggleVolumeOpen(open?: boolean) {
    if (open != null) {
      this.isVolumeOpen = open
    } else {
      //❤️ 将这里和下面的 listopen 进行代码优化
      this.isVolumeOpen = !this.isVolumeOpen;
    }
  }
  @action toggleShuffleMode() {
    this.isShuffleMode = !this.isShuffleMode
  }

  @action private pushToPlayerlist(t: ITrack) {
    if (this.playList.indexOf(t) === -1) {
      this.playList.push(t)
    }
  }

  addToPlaylist(tracks: ITrack | ITrack[]) {
    if ('length' in tracks) {
      (<ITrack[]>tracks).slice().forEach(t => {
        this.pushToPlayerlist(t)
      })
    } else {
      this.pushToPlayerlist(<ITrack>tracks)
    }

  }
  @action clearPlaylist() {
    this.playList = [];
  }
  @action removeFromPlaylist(...tracks: ITrack[]) {
    tracks.forEach(t => {
      const index = this.playList.indexOf(t)
      this.playList.splice(index, 1)
    })
  }
  @action togglePlaylistOpen(open?: boolean) {
    if (open != null) {
      this.isPlaylistOpen = open
    } else {
      this.isPlaylistOpen = !this.isPlaylistOpen;
    }
  }

  @computed get getPlaylistCount() {
    return this.playList && this.playList.length;
  }
  @computed get playingUrl() {
    if (this.playingTrack) {
      let url = this.playingTrack.stream_url;
      url = addAccessToken(url, '?');
      // console.log(url)
      return url
    }
    return ""
  }
  @action playNextTrack(diff: number): boolean {
    if (this.getPlaylistCount < 1) {
      return false;
    }
    let nextTrack = null;
    if (this.isShuffleMode) {
      const newList = this.playList.slice();
      const deleIndex = newList.indexOf(this.playingTrack)
      newList.splice(deleIndex, 1);
      nextTrack = newList[parseInt(Math.random() * 10 + "") % newList.length];
    } else {
      let changedIndex = 0;
      if (this.playingTrack) {
        changedIndex = this.playList.indexOf(this.playingTrack) + diff;
      }
      nextTrack = this.playList[changedIndex];
    }
    if (nextTrack == undefined) {
      debugger;
    }
    this.setPlayingTrack(nextTrack);

    return true;
  }
}

export default new PlayerStore();