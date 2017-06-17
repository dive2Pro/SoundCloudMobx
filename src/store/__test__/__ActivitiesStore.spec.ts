jest.mock('../../services/Fetch.ts');
import {ActivitiesStore} from '../ActivitiesStore';
import {IObservableArray} from 'mobx';
import {CLIENT_ID} from '../../constants/authentification';
import {FETCH_ACTIVITIES} from '../../constants/fetchTypes';
import {IActivitiesItem} from '../../interfaces/interface';

describe('ActivitiesStore', () => {
  let as: ActivitiesStore;
  const track: any = {id: '236107824'};

  // tslint:disable-next-line:max-line-length
  const expectNextHref = `https://api.soundcloud.com/tracks/236107824/comments?limit=50&linked_partitioning=1&client_id=${CLIENT_ID}`;
  beforeEach(() => {
    as = new ActivitiesStore();
  });

  it('初始化,检测属性', () => {
    expect(as.currentGenre).toBe(FETCH_ACTIVITIES);
    expect(as.filterType).toBeUndefined();
    expect(as.filterTitle).toBeUndefined();
    expect(as.sortType).toBeUndefined();
    expect(as.filteredTracks.slice()).toEqual([]);
    expect(as.isLoading).toBe(false);
    expect(as.nextHref).toBe('');
    expect(as.tracks).toEqual([]);
  });

  it('@action setFilter....', () => {
    const title = 'track';
    as.setFilterTitle(title);
    as.setSortType(title);
    as.setFilterType(title);
    expect(as.filterTitle).toBe(title);
    expect(as.sortType).toBe(title);
    expect(as.filterType).toBe(title);
  });

  it('@action isLoadingByGenre', () => {
    as.setLoadingByGenre(FETCH_ACTIVITIES, true);
    expect(as.isLoading).toBe(true);
    as.setLoadingByGenre(FETCH_ACTIVITIES, false);
    expect(as.isLoading).toBe(false);
    as.setLoadingActivities(true);
    expect(as.isLoading).toBe(true);
  });

  it('@action setNextActivitiesHref', () => {
    const title = 'track';
    as.setNextActivitiesHref(title);
    expect(as.nextHref).toBe(title);
  });

  it('getAllTrackFromActivity', () => {
    const act = {
      origin: {name: 'haha'},
      type: 'qwe',
      created_at: 'qq',
      tags: 'qwetag'
    };
    const receive = as.getAllTrackFromActivity(act as any);
    expect(receive).toEqual(act.origin);
  });

  it('filterByFilterType', () => {
    const acts = [
      {
        type: 'h',
        name: '1'
      },
      {
        type: 'h',
        name: '1'
      },
      {
        type: 'h',
        name: '12'
      },
      {
        type: 's',
        name: '1'
      }
    ];
    as.setFilterType('h');
    const receive = as.filterByFilterType(acts as any);
    const expected = acts.filter(item => item.type === 'h');
    expect(receive).toEqual(expected);
    expect(receive).not.toEqual(acts);
  });

  it('filterActivities', async () => {
    const acts: any = [
      {
        type: 'h',
        created_at: '1'
      },
      {
        type: 'h',
        created_at: '2'
      },
      {
        type: 'h',
        created_at: '12'
      },
      {
        type: 'hs',
        created_at: '12'
      },
      {
        type: 's',
        created_at: '3'
      }
    ];
    const addActs: any = [
      {
        type: 'h',
        created_at: '1'
      },
      {
        type: 'h2',
        created_at: '12'
      },
      {
        type: 'h3',
        created_at: '4'
      },
      {
        type: 'h4',
        created_at: '5'
      }
    ];
    as.addActivities(acts);
    expect(as.currentItems.slice()).toEqual(acts);
    await as.filterActivities(addActs);
    const expected = acts.concat([
      {
        type: 'h3',
        created_at: '4'
      },
      {
        type: 'h4',
        created_at: '5'
      }
    ]);
    expect(as.currentItems.slice()).toEqual(expected);
  });

  it('@action fetchNextActivities', async () => {
    as.setLoadingActivities(true);
    const r1 = await as.fetchNextActivities();
    // console.log(as.isLoading)
    expect(r1).toBeUndefined();
    const ary: any = [1, 2, 3];
    as.addActivities(ary);
    const r2 = await as.fetchNextActivities(true);
    expect(r2).toBeUndefined();
    (<IObservableArray<any>> as.currentItems).clear();
    as.setLoadingActivities(false);
    await as.fetchNextActivities();
    const expected = [{name: 2}, {name: 1}, {name: 3}, {name: 4}];
    expect(as.currentItems.slice()).toEqual(expected);
    expect(as.nextHref).toEqual('hongmao');
  });

  it('mobx compute', () => {
    const newGenre = 'newGenre';
    as.setNextActivitiesHref('hahahaha');
    as.setLoadingActivities(true);
    const addActs: any = [
      {
        type: 'h',
        created_at: '1'
      },
      {
        type: 'h2',
        created_at: '12'
      },
      {
        type: 'h3',
        created_at: '4'
      },
      {
        type: 'h4',
        created_at: '5'
      }
    ];
    as.addActivities(addActs);

    as.setGenre(newGenre);

    expect(as.currentItems.slice()).toEqual([]);
    expect(as.nextHref).toEqual('');
    expect(as.isLoading).toEqual(false);

    as.setGenre(FETCH_ACTIVITIES);

    expect(as.currentItems.slice()).toEqual(addActs);
    expect(as.nextHref).toEqual('hahahaha');
    expect(as.isLoading).toEqual(true);
  });
  //   it('@action submitReplay', async (done) => {
  //       cs.setCurrentTrack(track)
  //       // const bindSetCurrentTrack = myMock.bind(cs)
  //       // bindSetCurrentTrack(track)
  //       const user:any={}
  //       sessionStore.user=user
  //       await cs.submitReplay(123, 'hyc')
  //       // expect(cs.isLoadingMoreComment).toEqual(true)
  //       // console.log(myMock.mock.calls);
  //       done()
  //       const comment = rawData('hyc')
  //       expect(cs.isLoadingMoreComment).toEqual(false)
  //       expect(cs.currentTrackComments).not.toBeNull()
  //       expect(cs.currentTrackComments.length).toBe(1);
  //       expect(cs.currentTrackComments.shift()).toEqual(comment)
  //       done();
  //   })

  //   it("fetchMoreComments",async (done) => {
  //     cs.setCurrentTrack(track)
  //     expect(cs.currentTrackComments.length).toBe(0);
  //     await cs.fetchMoreComments()
  //     expect(cs.currentCommentNextHref)
  //       .toBe(expectNextHref);
  //     done()
  // });
});
