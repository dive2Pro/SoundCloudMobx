import {
  action, observable, runInAction
  , computed, ObservableMap, autorun, whyRun, IReactionDisposer, IObservableArray
} from 'mobx';
import {
  ITrack
} from '../interfaces/interface';
export { ITrack }
import {
  unauthApiUrl
} from '../services/soundcloundApi'
import UserStore, { ActivitiesStore } from './UserStore'
import PerformanceStore from "./PerformanceStore";
export class Track {

  @action updateFromJson(data: any) {
    Object.assign(this, data);
  }
}

export interface ITrackStore {
  fetchTracks: (nextHref: string, genre?: string) => void;
  isLoading: boolean;
  currentTracks: ITrack[]
  setGenre: (genre: string) => void;
  getTrackFromId: (id: number) => ITrack
}
export abstract class BaseAct<T> {

  // 记得初始化
  itemsMap = new ObservableMap<T[]>();
  @observable nextHrefsByGenre = new ObservableMap<string>();
  @observable isLoadingByGenre = new ObservableMap<boolean>();

  @observable filterType: string
  @observable filterTitle: string
  @observable sortType: string

  @observable filteredTracks: ITrack[] = []
  @observable currentGenre: string = 'country'

  autorunHandle: IReactionDisposer;

  constructor(genre: string) {
    this.setGenre(genre);
  }


  initFilterFunction(type: string) {

    if (this.autorunHandle) {
      this.autorunHandle();
    }
    let has = this.itemsMap.has(type);
    if (!has) {
      this.itemsMap.set(type, []);
    }
    this.autorunHandle = autorun(() => {
      this.filterFunc(<T[]>this.itemsMap.get(type), this.sortType, this.filterType)
    })

    whyRun(this.autorunHandle);

  }

  @action setFilterTitle(title: string) {
    this.filterTitle = title;
  }
  @action setSortType(type: string) {
    this.sortType = type;
  }
  @action setFilterType(filterType: string = "") {
    this.filterType = filterType;
  }

  filterByFilterType(fs: T[]): T[] {
    return fs;
  }
  abstract transToTracks(act: T[]): ITrack[];

  async filterFunc(activities: T[], sortType: string, filterType: string) {
    let fs: ITrack[] = []
    const filterByTypes = await this.filterByFilterType(activities)
    fs = await this.transToTracks(filterByTypes)
    fs = await this.filterByFilterTitle(fs);
    fs = await this.filterBySortType(fs);

    runInAction('set-filteredTracks', () => {
      (<IObservableArray<ITrack>>this.filteredTracks).replace(fs)
    })
  }
  filterBySortType(fs: ITrack[]) {
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
  filterByFilterTitle(fs: ITrack[]) {
    let temp = fs.slice();
    if (!!this.filterTitle) {
      temp = fs.filter(item => {
        return item.title.indexOf(this.filterTitle) > -1
      })
    }
    return temp
  }
  @action setLoadingByGenre(genre: string, loading: boolean) {
    this.isLoadingByGenre.set(genre, loading);
  }

  @action setNextHrefByGenre(genre: string, nextHref: string) {
    this.nextHrefsByGenre.set(genre, nextHref)
  }
  @action setGenre(genre: string) {
    genre = genre.toLocaleLowerCase();
    this.currentGenre = genre;
    PerformanceStore.setCurrentGenre(this.currentGenre)
    this.initFilterFunction(genre);
  }
  @computed get currentItems(): T[] {
    return <T[]>this.itemsMap.get(this.currentGenre)
  }

  @computed get nextHref() {
    return this.nextHrefsByGenre.get(this.currentGenre) || ""
  }
}

class TrackStore extends BaseAct<ITrack> implements ITrackStore {
  token: string = ""
  static defaultGenre = 'country';

  @computed get isLoading(): boolean {
    return this.isLoadingByGenre.get(this.currentGenre) || false
  }

  @computed get hasCurrentGenreTracks() {
    // const items = this.itemsMap.get(this.currentGenre)
    return this.currentItems && this.currentItems.length > 0;
  }

  @computed get currentTracks() {
    const tracks = this.itemsMap.get(this.currentGenre) || [];
    return tracks
  }
  getTrackFromId(id: number): ITrack {
    let track = this.currentTracks.find((track) => track.id == id)
    if (!track) {
      track = this.allTracks().find((track) => track.id == id)
    }
    if (track) return track
    throw Error('Cant find a track from gaving id ')
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
    return ActivitiesStore.tracks
      .concat(tracks, UserStore.AllUsersFavorities);
  }


  @action async fetchTracks() {
    if (this.isLoading) {
      return;
    }
    let genre = this.currentGenre || "country", url;
    url = this.nextHref
    if (!url) {
      url = unauthApiUrl(`tracks?linked_partitioning=1&limit=20&offset=0&genres=${genre.toLocaleLowerCase()}`, "&")
    }

    this.fetchData(url)
  }

  @action setGenre(genre: string) {
    super.setGenre(genre);

    if (!this.hasCurrentGenreTracks) {
      this.fetchTracks();
    }

  }
  async fetchData(url: string, gr?: string) {
    const genre = gr || (this.currentGenre || TrackStore.defaultGenre)
    try {
      this.setLoadingByGenre(genre, true)

      const raw: any = await fetch(url)
      const data = await raw.json()
      runInAction('loadtracks', () => {
        this.tracks = { genre, values: data.collection };

      })
      this.setNextHrefByGenre(genre, data.next_href);
      this.setLoadingByGenre(genre, false)
    } finally {
      this.setLoadingByGenre(genre, false)
    }
  }

}

export default new TrackStore(TrackStore.defaultGenre);