import {
  observable,
  action,
  IObservableArray,
  ObservableMap,
  computed,
  expr
} from 'mobx';

let $rem = 14;
export class PerformanceStore {
  _breaks = {
    $breakMedium: 700
  };

  @observable windowWidth = window.innerWidth;

  onceLoadingIsAllSettle: boolean;
  scrollLimitByGenre = new ObservableMap<number[]>();
  @observable genre: string;
  // 这个用来记录当前应该被 player 进行毛玻璃效果处理的dom id
  @observable glassNode: string;
  @observable scrollY: number;
  isLoadingsByKey = new ObservableMap<boolean>();
  isErrorsMap = new ObservableMap<boolean>();

  @observable trackPalatteColor;
  @computed
  get scrollLimit(): number[] {
    return this.scrollLimitByGenre.get(this.genre) || [];
  }

  @action
  setCurrentGenre(genre: string) {
    this.genre = genre;
    if (!this.scrollLimitByGenre.get(genre)) {
      this.scrollLimitByGenre.set(genre, [
        window.innerHeight,
        window.innerHeight
      ]);
    }
  }

  getLoadingState(type: string): boolean {
    return this.isLoadingsByKey.get(type) || false;
  }

  @action
  setScrollLimit(...limit: number[]) {
    const map = this.scrollLimitByGenre.get(this.genre);
    if (map) {
      (<IObservableArray<number>>map).replace(limit);
    } else {
      this.scrollLimitByGenre.set(this.genre, limit);
    }
  }

  @action
  setCurrentGlassNodeId(id: string) {
    this.glassNode = id;
  }

  @action
  setScrollY(y: number) {
    this.scrollY = y;
  }

  @action
  setLoadingStateWithKey = (key: string, loading: boolean) => {
    this.isLoadingsByKey.set(key, loading);
  };

  getLoadingStateWidthKey = (key: string) => {
    return this.isLoadingsByKey.get(key) || false;
  };

  /**
   * 当前所以请求完毕
   */
  @computed
  get allLoadingIsSettle(): boolean {
    const allSettle = expr(() =>
      Array.from(this.isLoadingsByKey.values()).every(v => v === false)
    );
    return allSettle;
  }

  isError = (genre: string): boolean => {
    return this.isErrorsMap.get(genre) || false;
  };

  @action
  catchErr = (err: any, genre: string) => {
    this.isErrorsMap.set(genre, true);
  };

  @action
  resetErrorsMap = (fetchType: string) => {
    this.isErrorsMap.set(fetchType, false);
  };

  @action
  setWindowSize(size) {
    this.windowWidth = size;
  }

  isUnder(size): boolean {
    return this.windowWidth < size;
  }

  @computed
  get isUnderMedium() {
    const is = this.windowWidth <= 680;
    return is;
  }

  @computed
  get isUnderHandsets() {
    const is = this.windowWidth <= 575;

    return is;
  }

  @computed
  get isUnderLarge() {
    return this.windowWidth < 1200;
  }

  @action
  setTrackPalettesBackground(backgroundColor: string) {
    this.trackPalatteColor = backgroundColor;
  }

  getSizeWithSpecWidth(
    def: number,
    large: number,
    mediumn: number,
    handset: number
  ) {
    return this.isUnderHandsets
      ? handset
      : this.isUnderMedium ? mediumn : this.isUnderLarge ? large : def;
  }

  px2rem($px) {
    return $px / $rem;
    // +this.getSizeWithSpecWidth(14:);
  }
}

export default new PerformanceStore();
