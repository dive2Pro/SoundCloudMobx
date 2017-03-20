import { observable, action, computed } from 'mobx';
import { apiUrl, addAccessToken } from '../services/soundcloundApi'
import { ITrack } from '../interfaces/interface';
export { ITrack }
export class Track {

  constructor() {

  }

  @action updateFromJson(data: any) {
    Object.assign(this, data);
  }
}

export interface ITrackStore {
  fetchActivities: (nexthref?: string) => void;
  activities: ITrack[];
  isLoadingActivities: boolean;
  activitiesCount: number

}



class TrackList {
  @observable activities: Track[] = [];
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

  @action addActivities(arr: ITrack[]) {
    arr.forEach(track => {
      const t = new Track()
      t.updateFromJson(track);
      this.activities.push(t);
    })
  }
  @action changeLoadings(type: any) {
    this[type] = !this[type];
  }
  @action setLoadingActivities(b: boolean) {
    this.isLoadingActivities
  }
  @action fetchActivities(nextHref?: string) {
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
        this.addActivities(data.collection);
        this.setLoadingActivities(false)

      })
  }
}

export default new TrackList();