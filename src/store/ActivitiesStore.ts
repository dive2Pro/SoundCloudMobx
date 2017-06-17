import {action, computed, runInAction} from 'mobx';
import BaseStreamStore from './BaseStreamStore';
import {IActivitiesItem, ITrack} from '../interfaces/interface';
import {FETCH_ACTIVITIES} from '../constants/fetchTypes';
import performanceStore from './PerformanceStore';
import {addAccessToken, apiUrl} from '../services/soundcloundApi';
import {RaceFetch as fetch} from '../services/Fetch';

export class ActivitiesStore extends BaseStreamStore<IActivitiesItem> {
  constructor() {
    super();
    this.setGenre(FETCH_ACTIVITIES);
  }

  @action
  setNextActivitiesHref(nextHref: string) {
    this.setNextHrefByGenre(FETCH_ACTIVITIES, nextHref);
  }

  @action
  addActivities(arr: IActivitiesItem[]) {
    const itemsLength = this.currentItems.length;
    this.currentItems.splice(itemsLength, 0, ...arr);
    // const t : any= []
    // const iis:any = t.splice(0, 0, ...arr)
    // console.log(
    //   // t, '-------------',
    //   this.currentItems)
  }

  transToTracks(items: IActivitiesItem[]): ITrack[] {
    return items.map(this.getAllTrackFromActivity).filter(item => item != null);
  }

  getAllTrackFromActivity(act: IActivitiesItem) {
    return act.origin;
  }

  @computed
  get tracks() {
    return (
      this.currentItems && this.currentItems.map(this.getAllTrackFromActivity)
    );
  }

  filterByFilterType(fs: IActivitiesItem[]) {
    let temp = fs.slice();
    if (!!this.filterType) {
      temp = fs.filter(item => {
        return item.type === this.filterType;
      });
    }
    return temp;
  }
  async filterActivities(arr: IActivitiesItem[]) {
    const filterArr = await arr.filter(item => {
      const b = this.currentItems.some(
        active => active.created_at === item.created_at
      );
      return !b;
    });
    this.addActivities(filterArr);
  }

  setLoadingActivities(b: boolean) {
    this.setLoadingByGenre(FETCH_ACTIVITIES, b);
  }

  async fetchNextActivities(first?: boolean) {
    if (this.isLoading) {
      return;
    }

    if (first && this.currentItems.length > 0) {
      return;
    }

    performanceStore.setCurrentGenre(this.currentGenre);
    await this.fetchActivities(this.nextHref);
  }
  @action
  private async fetchActivities(nextHref?: string) {
    if (this.isLoading) {
      return;
    }
    let activitiesUrl = nextHref
      ? addAccessToken(nextHref, '&')
      : apiUrl(`me/activities?limit=50`, '&');
    try {
      this.setLoadingActivities(true);
      const data: any = await fetch(activitiesUrl);
      runInAction(() => {
        this.setNextActivitiesHref(data.next_href);
        this.filterActivities(data.collection);
      });
    } catch (err) {
      this.catchErr(err, this.currentGenre);
    } finally {
      this.setLoadingActivities(false);
    }
  }
}

const activitiesStore = new ActivitiesStore();

export {activitiesStore as default};
