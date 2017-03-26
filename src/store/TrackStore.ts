import {
  action, observable, runInAction
  // , extendObservable
  , computed, ObservableMap
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
  play() {

  }
}

export interface ITrackStore {
  fetchTracks: (nextHref: string, genre?: string) => void;
  isLoading: boolean;
  currentTracks: ITrack[]
  setGenre: (genre: string) => void;
}

class TrackList implements ITrackStore {
  token: string = ""
  tracksByGenre = new ObservableMap<ITrack[]>();
  @observable currentGenre: string
  @observable nextHrefsByGenre = new ObservableMap<string>();
  @observable isLoadingByGenre = new ObservableMap<boolean>();
  // @observable currentTracks: ITrack[] = [];

  constructor() {

  }

  @computed get isLoading(): boolean {
    return this.isLoadingByGenre.get(this.currentGenre) || false
  }

  @computed get hasCurrentGenreTracks() {
    return this.tracksByGenre.has(this.currentGenre);
  }
  @computed get currentTracks() {
    const tracks = this.tracksByGenre.get(this.currentGenre) || [];
    console.log(this.currentGenre, tracks)
    return tracks
  }
  @computed get nextHref() {
    return this.nextHrefsByGenre.get(this.currentGenre) || ""
  }
  @action setLoadingByGenre(genre: string, loading: boolean) {
    this.isLoadingByGenre.set(genre, loading);
  }

  set tracks({ genre, values }: { genre: string, values: ITrack[] }) {
    console.log('--------', genre)
    const tracks = this.tracksByGenre.get(genre);
    if (tracks && Array.isArray(tracks.slice())) {
      tracks.splice(tracks.length, 0, ...values);
    } else {
      this.tracksByGenre.set(genre, values);
    }
  }

  @action setGenre(genre: string) {
    genre = genre.toLocaleLowerCase()
    this.currentGenre = genre;
    if (!this.hasCurrentGenreTracks) {
      this.fetchTracks();
    }
  }

  @action setNextHrefByGenre(genre: string, nextHref: string) {
    this.nextHrefsByGenre.set(genre, nextHref)
  }

  @computed get allTracks() {
    return this.tracksByGenre.entries()
      .map(({ values }) => {
        return values;
      });
  }

  @action async fetchTracks() {
    let url = "", genre = this.currentGenre || "country";
    const nextHref = this.nextHref;
    if (nextHref) {
      url = nextHref
    } else {
      url = unauthApiUrl(`tracks?linked_partitioning=1&limit=50&offset=0&genres=${genre.toLocaleLowerCase()}`, "&")
    }
    this.setLoadingByGenre(genre, true)
    const data: any = await fetch(url).then(response => response.json())
    //todo catch error 
    // debugger;
    runInAction('loadtracks', () => {
      this.tracks = { genre, values: data.collection };

      this.setNextHrefByGenre(genre, data.next_href);
      this.setLoadingByGenre(genre, false)
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