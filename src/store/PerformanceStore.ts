import {
  observable
  , action
  , IObservableArray
  , ObservableMap
  , computed
  , expr
  // , when
} from 'mobx'

export interface IPerformanceStore {
  scrollLimit: number[]
  glassNode: string
  scrollY: number
  setScrollLimit: (...limit: number[]) => void
  setCurrentGenre: (genre: string) => void
  setCurrentGlassNodeId: (id: string) => void
  allLoadingIsSettle: boolean
}


class PerformanceStore implements IPerformanceStore {
  onceLoadingIsAllSettle: boolean;

  scrollLimitByGenre = new ObservableMap<number[]>()
  @observable genre: string
  // 这个用来记录当前应该被 player 进行毛玻璃效果处理的dom id
  @observable glassNode: string
  @observable scrollY: number
  isLoadingsByKey = new ObservableMap<boolean>();

  @computed get scrollLimit(): number[] {
    return this.scrollLimitByGenre.get(this.genre) || [];
  }

  @action setCurrentGenre(genre: string) {
    this.genre = genre;
    if (!this.scrollLimitByGenre.get(genre)) {
      // window.innerHeight + window.pageYOffset
      this.scrollLimitByGenre.set(
        genre,
        [window.innerHeight, window.innerHeight]
      )
    }
  }

  @action setScrollLimit(...limit: number[]) {
    const map = this.scrollLimitByGenre.get(this.genre);
    if (map) {
      (<IObservableArray<number>>map).replace(limit);
    } else {
      this.scrollLimitByGenre.set(this.genre, limit)
    }
  }

  @action setCurrentGlassNodeId(id: string) {
    this.glassNode = id;
  }

  @action setScrollY(y: number) {
    this.scrollY = y;
  }

  @action setLoadingStateWithKey = (key: string, loading: boolean) => {
    this.isLoadingsByKey.set(key, loading)
  }

  getLoadingStateWidthKey = (key: string) => {
    return this.isLoadingsByKey.get(key) || false
  }

  /**
   * 当前所以请求完毕
   */
  @computed get allLoadingIsSettle(): boolean {
    const allSettle = expr(() =>
      Array.from(this.isLoadingsByKey.values()).every(v => v === false))
    return allSettle
  }

}

export default new PerformanceStore()