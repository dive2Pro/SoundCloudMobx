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
    arr.filter(item => {
      return !this.activities.some(active => active.origin.id === item.origin.id)
    }).forEach(track => {
      // const t = new ActivitiesItem()
      // t.updateFromJson(track);
      this.activities.push(track);
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
  @action fetchPlaylists(id: number) {
    const playlistUrl = addAccessToken(`users/${id}/playlists`, "?")
    fetch(playlistUrl)
      .then(response => response.json())
      .then((data: any) => {

      })
  }
}

export default new TrackList();