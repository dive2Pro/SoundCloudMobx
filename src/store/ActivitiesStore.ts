import { observable, action, computed, runInAction } from 'mobx'
import { BaseAct } from './TrackStore';
import { IActivitiesItem, ITrack } from '../interfaces/interface';
import { FETCH_ACTIVITIES } from '../constants/fetchTypes';
import { performanceStore } from './index';
import { addAccessToken, apiUrl } from '../services/soundcloundApi';
import { RaceFetch as fetch } from '../services/Fetch'
export class ActivitiesStore extends BaseAct<IActivitiesItem>  {

  @observable filteredActivities: IActivitiesItem[];

  constructor() {
    super(FETCH_ACTIVITIES)
  }


  @action setNextActivitiesHref(nextHref: string) {
    this.setNextHrefByGenre(FETCH_ACTIVITIES, nextHref)
  }

  @action addActivities(arr: IActivitiesItem[]) {
    const items = this.currentItems;
    items.splice(items.length, 0, ...arr);

  }

  transToTracks(items: IActivitiesItem[]): ITrack[] {
    return items.map(this.getAllTrackFromActivity).filter(item => item != null);
  }

  getAllTrackFromActivity(act: IActivitiesItem) {
    return act.origin
  }

  @computed get tracks() {
    return this.currentItems && this.currentItems.map(this.getAllTrackFromActivity)
  }

  filterByFilterType(fs: IActivitiesItem[]) {
    let temp = fs.slice();
    if (!!this.filterType) {
      temp = fs.filter(item => {
        return item.type === this.filterType
      })
    }
    return temp;
  }
  async filterActivities(arr: IActivitiesItem[]) {
    if (!arr) { return }
    const filterArr = await arr.filter(item => {
      const b = this.currentItems.some(active =>
        active.created_at === item.created_at)
      return !b;
    })

    this.addActivities(filterArr);

  }

  @action setLoadingActivities(b: boolean) {
    this.setLoadingByGenre(FETCH_ACTIVITIES, b);
  }

  @action fetchNextActivities(first?: boolean) {
    performanceStore.setCurrentGenre(this.currentGenre)
    if (first && this.currentItems.length > 0) {
      return
    }
    if (!this.isLoading) {
      this.fetchActivities(this.nextHref);
    }
  }
  @action async fetchActivities(nextHref?: string) {
    let activitiesUrl = nextHref ? addAccessToken(nextHref, '&') :
      apiUrl(`me/activities?limit=50`, '&')
    try {
      this.setLoadingActivities(true);
      const data: any = await fetch(activitiesUrl)
      runInAction(() => {
        this.setNextActivitiesHref(data.next_href)
        this.filterActivities(data.collection);
        this.setLoadingActivities(false)
      })
    } catch (err) {
      this.catchErr(err, this.currentGenre)
    }
    finally {
      this.setLoadingActivities(false)
    }
  }
}

const activitiesStore = new ActivitiesStore();

export { activitiesStore as default };
