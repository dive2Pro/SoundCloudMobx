import { observable, action, IObservableArray } from 'mobx'
export interface IPerformanceStore {
  scrollLimit: number[]
  setScrollLimit: (...limit: number[]) => void
}


class PerformanceStore implements IPerformanceStore {

  @observable scrollLimit: number[] = []

  @action setScrollLimit(...limit: number[]) {
    (<IObservableArray<number>>this.scrollLimit).replace(limit);
  }
}

export default new PerformanceStore()