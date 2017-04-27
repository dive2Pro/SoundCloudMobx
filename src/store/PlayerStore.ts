import { observable, action, computed } from 'mobx';
import { addClientId } from '../services/soundcloundApi'
import { ITrack } from '../interfaces/interface'

const isEqual =require('lodash/isEqual')
export class PlayerStore {
  @observable playingTrack: ITrack
  @observable isPlaying: boolean = false;
  @observable playList: ITrack[] = [];

  @observable isPlaylistOpen: boolean = false;
  @observable isShuffleMode: boolean = false;
  @observable isVolumeOpen: boolean = false

  @observable volume: number = 0.25

  @action setVolume(v: number) {
    this.volume = v;
  }

  @action setPlayingTrack(track: ITrack | number) {
    if (typeof track === 'number') {
      track = this.playList[track];
    }

    if (isEqual(this.playingTrack, track) && this.isPlaying) {
      this.isPlaying = false;
      
    } else {
      this.playingTrack = track;
      this.isPlaying = true;
      this.addToPlaylist(track);
    }
  }

  @action togglePlaying() {
    if(!this.playingTrack){
        this.playNextTrack(1)
    }else{
      this.isPlaying = !this.isPlaying;

    }

  }
  @action toggleVolumeOpen(open?: boolean) {
    if (open != null) {
      this.isVolumeOpen = open
    } else {
      this.isVolumeOpen = !this.isVolumeOpen;
    }
  }

  @action toggleShuffleMode() {
    this.isShuffleMode = !this.isShuffleMode
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
      let url = this.playingTrack.uri + '/stream';
      url = addClientId(url, '?');
      return url
    }
    return ''
  }
  @action playNextTrack(diff: number): boolean {
    if (this.getPlaylistCount < 1) {
      return false;
    }
    
    let nextTrack: ITrack | undefined;
    if (this.isShuffleMode) {
      const newList = this.playList.slice();
      const deleIndex = newList.indexOf(this.playingTrack)
      newList.splice(deleIndex, 1);
      // tslint:disable-next-line:radix
      nextTrack = newList[parseInt(Math.random() * 10 + '') % newList.length];
    } else {
      let changedIndex = 0;
      if (this.playingTrack) {
        changedIndex = this.playList.indexOf(this.playingTrack) + diff;
      }

      nextTrack = this.playList[changedIndex];
    }
    if (nextTrack != null) {
      this.setPlayingTrack(nextTrack);
      return true
    }

    return false
  }

  addToPlaylist(tracks: ITrack | ITrack[]) {
    let ts:any = tracks
    if (ts.slice&&Array.isArray(ts.slice())) {
      (<ITrack[]>tracks).slice().forEach((t, i) => {
        i === 0 && this.setPlayingTrack(t)
        this.pushToPlayerlist(t)
      })
    } else {
      this.pushToPlayerlist(<ITrack>tracks)
    }
  }

  @action private pushToPlayerlist(t: ITrack) {
    if (!this.playList.some((item)=>item.id===t.id)) {
      this.playList.push(t)
    }
  }
}

export default new PlayerStore();