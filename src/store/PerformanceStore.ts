import {
  observable
  , action
  , IObservableArray
  , ObservableMap
  , computed
} from 'mobx'
// import TrackStore from './TrackStore'

export interface IPerformanceStore {
  scrollLimit: number[]
  setScrollLimit: (...limit: number[]) => void
  setCurrentGenre: (genre: string) => void
}


class PerformanceStore implements IPerformanceStore {

  scrollLimitByGenre = new ObservableMap<number[]>()
  @observable genre: string

  @computed get scrollLimit(): number[] {
    return this.scrollLimitByGenre.get(this.genre) || [];
  }

  @action setCurrentGenre(genre: string) {
    this.genre = genre;
    if (!this.scrollLimitByGenre.get(genre)) {
      // window.innerHeight + window.pageYOffset
      this.scrollLimitByGenre.set(genre,
        [window.innerHeight, window.innerHeight])
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

}

export default new PerformanceStore()