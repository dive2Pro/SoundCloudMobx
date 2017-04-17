import {
  action, observable, runInAction
  , computed, ObservableMap, autorun
  , IReactionDisposer, IObservableArray
} from 'mobx';
import {
  ITrack
} from '../interfaces/interface';
import {
  unauthApiUrl
} from '../services/soundcloundApi'
import UserStore from './UserStore'
import performanceStore from './PerformanceStore';
import { RaceFetch as fetch } from '../services/Fetch'
import activitiesStore from './ActivitiesStore';

import { GENRES } from '../constants/trackTypes'

export interface IBaseActStore {
  isLoading: boolean;
  currentGenre: string
  isError: (genre: string) => boolean
}
export abstract class BaseAct<T> implements IBaseActStore {

  // 记得初始化
  protected itemsMap = new ObservableMap<T[]>();
  @observable protected nextHrefsByGenre = new ObservableMap<string>();
  protected isLoadingByGenre = {
    get: performanceStore.getLoadingStateWidthKey
  }
  protected isErrorsMap = new ObservableMap<boolean>()

  // 排序和搜索过滤
  @observable filterType: string
  @observable filterTitle: string
  @observable sortType: string
  @observable filteredTracks: ITrack[] = []
  @observable currentGenre: string = GENRES[0]

  autorunHandle: IReactionDisposer;



  @computed get isLoading(): boolean {
    return this.isLoadingByGenre.get(this.currentGenre)
  }

  @action setFilterTitle(title: string) {
    this.filterTitle = title;
  }

  @action setSortType(type: string) {
    this.sortType = type;
  }

  @action setFilterType(filterType: string = '') {
    this.filterType = filterType;
  }

  setLoadingByGenre(genre: string, loading: boolean) {
    // this.isLoadingByGenre.set(genre, loading);
    performanceStore.setLoadingStateWithKey(genre, loading);
  }

  @action setNextHrefByGenre(genre: string, nextHref: string) {
    this.nextHrefsByGenre.set(genre, nextHref)
  }
  @action setGenre(genre: string) {
    // genre = genre.toLocaleLowerCase();
    this.currentGenre = genre;
    performanceStore.setCurrentGenre(this.currentGenre)
    this.initFilterFunction(genre);
  }
  @computed get currentItems(): T[] {
    return <T[]>this.itemsMap.get(this.currentGenre)
  }

  @computed get nextHref() {
    return this.nextHrefsByGenre.get(this.currentGenre) || ''
  }

  isError = (genre: string): boolean => {
    return performanceStore.isError(genre)
  }

  @action protected catchErr = (err: any, genre: string) => {
    performanceStore.catchErr(err, genre)
    console.error(err, genre)
  }
  protected resetErrorWithType = (type: string) => {
    performanceStore.resetErrorsMap(type)
  }
  protected filterByFilterType(fs: T[]): T[] {
    return fs;
  }
  abstract transToTracks(act: T[]): ITrack[];

  private async filterFunc(activities: T[], filterTitle: string, sortType: string, filterType: string) {
    let fs: ITrack[] = []
    const filterByTypes = await this.filterByFilterType(activities)
    fs = await this.transToTracks(filterByTypes)
    fs = await this.filterByFilterTitle(fs);
    fs = await this.filterBySortType(fs);

    runInAction('set-filteredTracks', () => {
      (<IObservableArray<ITrack>>this.filteredTracks).replace(fs)
    })
  }
  private filterBySortType(fs: ITrack[]) {
    let temp = fs.slice();
    if (!!this.sortType) {
      temp = fs.sort((p, n) => {
        let pCount = p[this.sortType];
        let nCount = n[this.sortType];
        pCount = !Number.isNaN(pCount) ? pCount : 0;
        nCount = !Number.isNaN(nCount) ? nCount : 0;
        return nCount - pCount;
      })
    }
    return temp
  }
  private filterByFilterTitle(fs: ITrack[]) {
    let temp = fs.slice();
    if (!!this.filterTitle) {
      temp = fs.filter(item => {
        return item.title.indexOf(this.filterTitle) > -1
      })
    }
    return temp
  }


  private initFilterFunction(type: string) {

    if (this.autorunHandle) {
      this.autorunHandle();
    }
    let has = this.itemsMap.has(type);
    if (!has) {
      this.itemsMap.set(type, []);
    }
    this.autorunHandle = autorun(() => {
      this.filterFunc(<T[]>this.itemsMap.get(type), this.filterTitle, this.sortType, this.filterType)
    })


  }
}
const debounce = require('lodash/debounce')

export class TrackStore extends BaseAct<ITrack> {
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



  @action async fetchTracks() {

    let requestGenre = this.currentGenre.toLocaleLowerCase() || 'country', url;
    url = this.nextHref
    if (!url) {
      url = unauthApiUrl(`tracks?linked_partitioning=1&limit=20&offset=0&genres=${requestGenre}`, '&')
    }
    let genre = this.currentGenre
    this.debouncedFetchData(url, (data: any) => {
      this.tracks = { genre, values: data.collection };
      this.setNextHrefByGenre(genre, data.next_href);
    })

  }


  @action setGenre(genre: string) {
    super.setGenre(genre);

    if (!this.hasCurrentGenreTracks) {
      this.fetchTracks();
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