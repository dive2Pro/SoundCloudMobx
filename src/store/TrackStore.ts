import { observable, action, computed } from 'mobx';
import { apiUrl, addAccessToken } from '../services/soundcloundApi'
import { ITrack, IActivitiesItem } from '../interfaces/interface';
export { ITrack }
export class ActivitiesItem {

  constructor() {

  }

  @action updateFromJson(data: any) {
    Object.assign(this, data);
  }
}

export class Track {

  constructor() {

  }

  @action updateFromJson(data: any) {
    Object.assign(this, data);
  }
}

export interface ITrackStore {
  fetchActivities: (nexthref?: string) => void;
  fetchNextActivities: () => void;
  activities: IActivitiesItem[];
  isLoadingActivities: boolean;
  activitiesCount: number
}



class TrackList {
  @observable activities: IActivitiesItem[] = [];
  @observable activities_nextHref$: string;
  @observable isLoadingActivities: boolean = false;
  constructor() {

  }
  @computed get activitiesCount() {
    return this.activities.length;
  }
  @action updateFromServer(nextHref: string) {

  }
  @action setNextActivitiesHref(nextHref: string) {
    this.activities_nextHref$ = nextHref;
  }

  @action addActivities(arr: IActivitiesItem[]) {
    this.activities.push(...arr);
  }

  filterActivities(arr: IActivitiesItem[]) {
    Promise.resolve(arr)
      .then(data => {
        const filterArr = data.filter(item => {
          const b = this.activities.some(active => active.created_at === item.created_at)
          console.log(b)
          return !b;
        })
        this.addActivities(filterArr);
      })
  }
  @action changeLoadings(type: any) {
    this[type] = !this[type];
  }
  @action setLoadingActivities(b: boolean) {
    this.isLoadingActivities = b;
  }
  @action fetchNextActivities() {
    if (!this.isLoadingActivities)
      this.fetchActivities(this.activities_nextHref$);
  }
  @action async fetchActivities(nextHref?: string) {
    let activitiesUrl;
    if (nextHref) {
      activitiesUrl = addAccessToken(nextHref, '&');
    } else {
      activitiesUrl = apiUrl(`me/activities?limit=50`, '&')
    }
    this.setLoadingActivities(true)
    fetch(activitiesUrl)
      .then(response => response.json())
      .then((data: any) => {
        this.setNextActivitiesHref(data.next_href)
        this.filterActivities(data.collection);
        this.setLoadingActivities(false)
      })
  }
  @action fetchPlaylists(id: number) {
    const playlistUrl = addAccessToken(`users/${id}/playlists`, "?")
    fetch(playlistUrl)
      .then(response => response.json())
      .then((data: any) => {

      })
  }
}

export default new TrackList();