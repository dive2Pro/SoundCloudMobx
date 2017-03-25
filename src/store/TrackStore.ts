import {
  action, observable, runInAction
  , extendObservable
  , computed
} from 'mobx';

import { addAccessToken } from '../services/soundcloundApi'
import { ITrack } from '../interfaces/interface';
export { ITrack }
// import { OAUTH_TOKEN, } from '../constants/authentification'
import {
  unauthApiUrl
  // , addAccessToken
  // , apiUrl
} from '../services/soundcloundApi'

// const Cookie = require('js-cookie');
export class Track {

  constructor() {

  }

  @action updateFromJson(data: any) {
    Object.assign(this, data);
  }

}

export interface ITrackStore {
  fetchTracks: (nextHref: string, genre?: string) => void;
  isLoading: boolean;
  tracks: ITrack[]
  currentTracks: ITrack[]
  setGenre: (genre: string) => void;
}

class TrackList implements ITrackStore {
  token: string = ""
  @observable tracksByGenre = {}
  @observable currentGenre: string
  @observable nextHrefsByGenre = {}
  @observable isLoadingByGenre = {}
  @observable currentTracks: ITrack[] = [];

  constructor() {

  }

  @computed get isLoading() {
    return this.isLoadingByGenre[this.currentGenre]
  }
  @action setLoadingByGenre(loading: boolean) {
    if (!this.isLoadingByGenre[this.currentGenre]) {
      extendObservable(this.isLoadingByGenre, { [this.currentGenre]: false })
    }
    this.isLoadingByGenre[this.currentGenre] = loading;
  }
  @action setGenre( genre :string ) {
    genre = genre.toLocaleLowerCase()
    this.currentGenre = genre;
    if (!this.tracksByGenre[genre]) { 
      this.fetchTracks();
    } else
      this.currentTracks = this.tracksByGenre[genre] || [];
  }
  @action setNextHrefByGenre(genre: string, nextHref: string) {
    // console.log(genre, nextHref)
    if (!this.nextHrefsByGenre[genre]) {
      extendObservable(this.nextHrefsByGenre, { [genre]: nextHref })
    }
    this.nextHrefsByGenre[genre] = nextHref;
  }
  @computed get nextHref() {
    return this.nextHrefsByGenre[this.currentGenre]
  }

  @computed get tracks() {
    if (this.currentGenre) {
      return this.tracksByGenre[this.currentGenre] || [];
    }

    return [];
  }

  @computed get allTracks() {
    return Object.keys(this.tracksByGenre)
      .map(key => {
        return this.tracksByGenre[key]
      })
  }

  @action async fetchTracks() {
    let url = "", genre = this.currentGenre || "country";
    const nextHref = this.nextHref;
    if (nextHref) {
      url = nextHref
    } else {
      url = unauthApiUrl(`tracks?linked_partitioning=1&limit=50&offset=0&genres=${genre.toLocaleLowerCase()}`, "&")
    }
    this.setLoadingByGenre(true)
    const data: any = await fetch(url).then(response => response.json())
    //todo catch error 
    runInAction('loadtracks', () => {
      if (!this.tracksByGenre[genre]) {
        extendObservable(this.tracksByGenre, { [genre]: [] });
        this.tracksByGenre[genre].observe((data: any) => {
          (this.currentGenre === genre) && (this.currentTracks = this.tracksByGenre[genre]);
        })
      }
      this.setNextHrefByGenre(genre, data.next_href);
      this.tracksByGenre[genre].push(...data.collection);
      this.setLoadingByGenre(false)
    })

  }

  // todo
  @action  async fetchPlaylists(id: number) {
    const playlistUrl = addAccessToken(`users/${id}/playlists`, "?")
    await fetch(playlistUrl)
      .then(response => response.json())
      .then((data: any) => {

      })
  }
}

export default new TrackList();