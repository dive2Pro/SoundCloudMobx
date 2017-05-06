import {
  action, observable, runInAction
  , computed, ObservableMap, autorun,
  extendObservable
  , IReactionDisposer, IObservableArray, isObservable
} from 'mobx';
import {
  ITrack
} from '../interfaces/interface';
import {
  unauthApiUrl
} from '../services/soundcloundApi'
import UserStore from './UserStore'
import { RaceFetch as fetch } from '../services/Fetch'
import activitiesStore from './ActivitiesStore';
import BaseStreamStore from './BaseStreamStore'
import { GENRES } from '../constants/trackTypes'

const debounce = require('lodash/debounce')

export class TrackStore extends BaseStreamStore<ITrack> {
  static defaultGenre = GENRES[0];
  debouncedFetchData: any;

  @observable currentTrack: ITrack
  constructor() {
    super()
    this.bindDebounced();
    this.setGenre(TrackStore.defaultGenre)
  }

  bindDebounced = () => {
    if (!this.debouncedFetchData) {
      this.debouncedFetchData = debounce(this.fetchData.bind(this), 50).bind(this)
    }
  }

  @computed get hasMoreTracks() {
    return this.hasCurrentGenreTracks
  }


  @computed get hasCurrentGenreTracks() {
    // const items = this.itemsMap.get(this.currentGenre)
    return this.currentItems && this.currentItems.length > 0;
  }

  @computed get currentTracks() {
    const tracks = this.itemsMap.get(this.currentGenre) || [];
    return tracks
  }

  setTrackId(id: number) {

    let track = this.currentTracks.filter(track => track != null).find((track) => track.id === id)
    if (!track) {
      track = this.allTracks().filter(track => track != null).find((track) => track.id === id)
    }
    if (track) {
      this.setCurrentTrack(track)
    } else {
      // 下载数据 
      this.fetchSingleTrack(id)
    }
  }

  @action setCurrentTrack(track: ITrack) {

    this.currentTrack = track
    if(!track.isLiked&&UserStore.isLogined){
        // 检查是否liked
      UserStore.checkLiked(track)
    }
  }

  @action changeLiked(track:ITrack,liked:boolean){
    if(!isObservable(track.isLiked)){
      extendObservable(track,'isLiked')
    }
      track.isLiked=liked
  }


  transToTracks(ts: ITrack[]) {
    return ts;
  }

  set tracks({ genre, values }: { genre: string, values: ITrack[] }) {

    const items = this.itemsMap.get(genre);

    if (items && Array.isArray(items.slice())) {
      items.splice(items.length, 0, ...values);
    } else {
      this.itemsMap.set(genre, values);
    }
  }
  allTracks(): ITrack[] {
    //todo 优化
    const values = this.itemsMap.values()
    const tracks = values.length > 0 ? values.reduce((preEntrey, currentEntry) => {
      return preEntrey.concat(currentEntry)
    }) : []
    return activitiesStore.tracks
      .concat(tracks, UserStore.AllUsersFavorities());
  }


  fetchSingleTrack(id: number) {
    const url = unauthApiUrl(`tracks/${id}`, '?')
    this.debouncedFetchData(url, (data) => {
      // 我只需要知道这个歌曲的信息,不需要放入那个 genre中.
      this.setCurrentTrack(data); // mayby Track?
    }, )
  }



  @action async fetchTracks(urlCallback?: () => string) {

    let requestGenre = this.currentGenre.toLocaleLowerCase() || 'country', url;
    url = this.nextHref

    if (!url) {
      if (urlCallback) {
        url = urlCallback();
      } else {
        url = `tracks?linked_partitioning=1&limit=20&offset=0&genres=${requestGenre}`;
      }
      url = unauthApiUrl(url, '&');
    }

    let genre = this.currentGenre
    
    this.debouncedFetchData(url, (data: any) => {
      this.tracks = { genre, values: data.collection };
      this.setNextHrefByGenre(genre, data.next_href);
    })

  }


  @action setGenre(genre: string, urlCallback?: () => string) {
    super.setGenre(genre);

    if (!this.hasCurrentGenreTracks) {
      this.fetchTracks(urlCallback);
    }
  }




  // 这里设计的不好,genre不太可调?
  // 如果只需要通过 this.currentGenre来,就不需要这个参数了吧?
  private async fetchData(url: string, fn: (data: any) => void, gr?: string) {
    if (this.isLoading) {
      return;
    }
    const genre = gr || (this.currentGenre || TrackStore.defaultGenre)
    try {
      this.setLoadingByGenre(genre, true)
      this.resetErrorWithType(genre)
      const data: any = await fetch(url)
      runInAction('loaddata', () => {
        fn.call(this, data)
      })
    } catch (e) {
      this.catchErr(e, genre)
    } finally {
      this.setLoadingByGenre(genre, false)
    }
  }

}

export default new TrackStore();