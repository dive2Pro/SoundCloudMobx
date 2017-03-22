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
  filteredActivities: IActivitiesItem[];
  isLoadingActivities: boolean;
  activitiesCount: number
  setFilterType: (type: string) => void;
  setSortType: (type: string) => void;
  setFilterTitle: (type: string) => void;
  filterType: string
  sortType: string
}


class TrackList {
  @observable activities: IActivitiesItem[] = [];
  @observable activities_nextHref$: string;
  @observable isLoadingActivities: boolean = false;
  @observable filterType: string
  @observable filterTitle: string
  @observable sortType: string
  constructor() {

  }


  @computed get activitiesCount() {
    return this.activities.length;
  }
  @action setFilterTitle(title: string) {
    this.filterTitle = title;
  }
  @action setSortType(type: string) {
    this.sortType = type;
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

  @action setFilterType(filterType: string = "") {
    this.filterType = filterType;
  }

  @computed get filteredActivities(): IActivitiesItem[] {
    let fs = this.activities;
    if (!!this.filterType) {
      fs = fs.filter(item => {
        return item.type === this.filterType
      })
    }

    if (!!this.sortType) {
      fs = fs.sort((p, n) => {
        console.log(this.sortType)
        let pCount = p.origin[this.sortType]
        let nCount = n.origin[this.sortType]
        pCount = !Number.isNaN(pCount) ? pCount : 0;
        nCount = !Number.isNaN(nCount) ? nCount : 0;
        debugger
        console.log(pCount + "- " + nCount)
        return nCount - pCount;
      })
    }

    if (!!this.filterTitle) {
      fs = fs.filter(item => {
        return item.origin.title.indexOf(this.filterTitle) > -1
      })
    }

    return fs;
  }
  // todo
  @action fetchPlaylists(id: number) {
    const playlistUrl = addAccessToken(`users/${id}/playlists`, "?")
    fetch(playlistUrl)
      .then(response => response.json())
      .then((data: any) => {

      })
  }
}

export default new TrackList();