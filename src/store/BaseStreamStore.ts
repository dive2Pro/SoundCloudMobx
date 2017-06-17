import performanceStore from './PerformanceStore';
import {
  action,
  observable,
  runInAction,
  computed,
  ObservableMap,
  autorun,
  IReactionDisposer,
  IObservableArray
} from 'mobx';

import {ITrack} from '../interfaces/interface';
import {GENRES} from '../constants/trackTypes';

export interface IBaseActStore {
  isLoading: boolean;
  currentGenre: string;
  isError: (genre: string) => boolean;
}
abstract class BaseStreamStore<T> implements IBaseActStore {
  static displayName = 'BaseAct';
  // 记得初始化
  protected itemsMap = new ObservableMap<T[]>();
  @observable protected nextHrefsByGenre = new ObservableMap<string>();
  protected isLoadingByGenre = {
    get: performanceStore.getLoadingStateWidthKey
  };
  protected isErrorsMap = new ObservableMap<boolean>();

  // 排序和搜索过滤
  @observable filterType: string;
  @observable filterTitle: string;
  @observable sortType: string;
  @observable filteredTracks: ITrack[] = [];
  @observable currentGenre: string = GENRES[0];

  autorunHandle: IReactionDisposer;

  @computed
  get isLoading(): boolean {
    return this.isLoadingByGenre.get(this.currentGenre);
  }

  @computed
  get nextHref() {
    return this.nextHrefsByGenre.get(this.currentGenre) || '';
  }

  @action
  setFilterTitle(title: string) {
    this.filterTitle = title;
  }

  @action
  setSortType(type: string) {
    this.sortType = type;
  }

  @action
  setFilterType(filterType: string = '') {
    this.filterType = filterType;
  }

  setLoadingByGenre(genre: string, loading: boolean) {
    // this.isLoadingByGenre.set(genre, loading);
    performanceStore.setLoadingStateWithKey(genre, loading);
  }

  @action
  setNextHrefByGenre(genre: string, nextHref: string) {
    this.nextHrefsByGenre.set(genre, nextHref);
  }

  @action
  setGenre(genre: string) {
    // genre = genre.toLocaleLowerCase();
    this.currentGenre = genre;
    performanceStore.setCurrentGenre(this.currentGenre);
    this.initFilterFunction(genre);
  }

  @computed
  get currentItems(): T[] {
    const hasItems = this.itemsMap.has(this.currentGenre);
    if (!hasItems) {
      this.itemsMap.set(this.currentGenre, []);
    }
    const item = this.itemsMap.get(this.currentGenre);
    return <T[]>item;
  }

  isError = (genre: string): boolean => {
    return performanceStore.isError(genre);
  };

  @action
  protected catchErr = (err: any, genre: string) => {
    performanceStore.catchErr(err, genre);
    console.error(err, genre);
  };
  protected resetErrorWithType = (type: string) => {
    performanceStore.resetErrorsMap(type);
  };
  protected filterByFilterType(fs: T[]): T[] {
    return fs;
  }
  abstract transToTracks(act: T[]): ITrack[];

  private async filterFunc(
    activities: T[],
    filterTitle: string,
    sortType: string,
    filterType: string
  ) {
    let fs: ITrack[] = [];
    const filterByTypes = await this.filterByFilterType(activities);
    // console.log(filterByTypes)
    fs = await this.transToTracks(filterByTypes);
    fs = await this.filterByFilterTitle(fs);
    fs = await this.filterBySortType(fs);

    runInAction('set-filteredTracks', () => {
      (<IObservableArray<ITrack>>this.filteredTracks).replace(fs);
    });
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
      });
    }
    return temp;
  }
  private filterByFilterTitle(fs: ITrack[]) {
    let temp = fs.slice();
    if (!!this.filterTitle) {
      temp = fs.filter(item => {
        return item.title.indexOf(this.filterTitle) > -1;
      });
    }
    return temp;
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
      this.filterFunc(
        <T[]>this.itemsMap.get(type),
        this.filterTitle,
        this.sortType,
        this.filterType
      );
    });
  }
}
export default BaseStreamStore;
