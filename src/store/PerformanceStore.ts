import {
  observable
  , action
  , IObservableArray
  , ObservableMap
  , computed
  , expr
} from 'mobx'

export class PerformanceStore {

   __breaks={
    $breakMedium:700
  }

  @observable windowWidth = window.innerWidth;

  onceLoadingIsAllSettle: boolean;
  scrollLimitByGenre = new ObservableMap<number[]>()
  @observable genre: string
  // 这个用来记录当前应该被 player 进行毛玻璃效果处理的dom id
  @observable glassNode: string
  @observable scrollY: number
  isLoadingsByKey = new ObservableMap<boolean>();
  isErrorsMap = new ObservableMap<boolean>()
  
  @computed get scrollLimit(): number[] {
    return this.scrollLimitByGenre.get(this.genre) || [];
  }

  @action setCurrentGenre(genre: string) {
    this.genre = genre;
    if (!this.scrollLimitByGenre.get(genre)) {
      this.scrollLimitByGenre.set(
        genre,
        [window.innerHeight, window.innerHeight]
      )
    }
  }

  getLoadingState(type: string): boolean {
    return this.isLoadingsByKey.get(type) || false
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


  isError = (genre: string): boolean => {
    return this.isErrorsMap.get(genre) || false
  }

  @action catchErr = (err: any, genre: string) => {
    this.isErrorsMap.set(genre, true);
  }

  @action resetErrorsMap = (fetchType: string) => {
    this.isErrorsMap.set(fetchType, false);
  }

  @action setWindowSize(size){
    this.windowWidth = size
  }

  @computed get isUnderLarge(){
    return this.windowWidth < 1200
  }

  @computed get iUnderMedium(){
    return this.windowWidth < 680
  }

  @computed get iUnderHandsets(){
    return this.windowWidth < 475
  }

}

export default new PerformanceStore()