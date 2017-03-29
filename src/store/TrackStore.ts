import {
  action, observable, runInAction
  // , extendObservable
  , computed, ObservableMap
} from 'mobx';
// import * as fetchTypes from '../constants/fetchTypes'
import { addAccessToken } from '../services/soundcloundApi'
import {
  ITrack
  // , IActivitiesItem
} from '../interfaces/interface';
export { ITrack }
import {
  unauthApiUrl,
  apiUrl
  // , addAccessToken
  // , apiUrl
} from '../services/soundcloundApi'
import UserStore, { ActivitiesStore } from './UserStore'
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
  getTrackFromId: (id: number) => ITrack
}

class TrackStore implements ITrackStore {
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
    return tracks
  }
  getTrackFromId(id: number): ITrack {
    let track = this.currentTracks.find((track) => track.id == id)
    if (!track) {
      track = this.allTracks.find((track) => track.id == id)
    }
    if (track) return track
    throw Error('Cant find a track from gaving id ')
  }
  @computed get nextHref() {
    return this.nextHrefsByGenre.get(this.currentGenre) || ""
  }
  @action setLoadingByGenre(genre: string, loading: boolean) {
    this.isLoadingByGenre.set(genre, loading);
  }

  set tracks({ genre, values }: { genre: string, values: ITrack[] }) {

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

  @computed get allTracks(): ITrack[] {
    //todo 优化
    const values = this.tracksByGenre.values()
    const tracks = values.length > 0 ? values.reduce((preEntrey, currentEntry) => {
      return preEntrey.concat(currentEntry)
    }) : []
    return ActivitiesStore.tracks
      .concat(tracks, UserStore.AllUsersFavorities);
  }

  fetchActivitiesURl(): string {
    return apiUrl('me/activities?limit=50', '&')
  }

  /*@observable filteredActivities: IActivitiesItem[];
  @observable activities: IActivitiesItem[] = [];

  @computed get filteredTracks() {
    return this.filteredActivities
      ? this.filteredActivities.map((item) => item.origin) : []
  }*/

  /* async filterActivities(arr: IActivitiesItem[]) {
     const filterData = await
       Promise.resolve(arr)
         .then(data =>
           data.filter(item => {
             const b =
               this.activities.some(active =>
                 active.created_at === item.created_at)
             // console.log(b)
             return !b;
           }))
     
     this.addActivities(filterData);
 
   }*/
  @action async fetchTracks() {
    let genre = this.currentGenre || "country", url;

    url = this.nextHref
    // if (!url && (genre = fetchTypes.FETCH_ACTIVITIES)) {
    // url = this.fetchActivitiesURl()
    // } else
    if (!url) {
      url = unauthApiUrl(`tracks?linked_partitioning=1&limit=50&offset=0&genres=${genre.toLocaleLowerCase()}`, "&")
    }


    this.setLoadingByGenre(genre, true)
    const data: any = await fetch(url).then(response => response.json())
    //todo catch error 
    runInAction('loadtracks', () => {
      // if (genre === fetchTypes.FETCH_ACTIVITIES) {
      // } else {
      this.tracks = { genre, values: data.collection };
      // }
      this.setNextHrefByGenre(genre, data.next_href);
      this.setLoadingByGenre(genre, false)
    })

  }

  // todo
  @action  async fetchPlaylists(id: number) {
    const playlistUrl = addAccessToken(`users/${id}/playlists`, "?")
    // const data =
    await fetch(playlistUrl)
      .then(response => response.json());

  }
}

export default new TrackStore();