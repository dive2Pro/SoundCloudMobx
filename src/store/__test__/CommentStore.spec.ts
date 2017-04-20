jest.mock('../../services/Fetch.ts')
import { CommentStore, rawData } from '../CommentStore'
import sessionStore from '../SessionStore'
import * as _ from 'lodash'
import {CLIENT_ID} from '../../constants/authentification'


describe('CommentStore', () => {
  let cs:CommentStore
  const track: any = { id: '236107824' }
  // tslint:disable-next-line:max-line-length
  const expectNextHref = `https://api.soundcloud.com/tracks/236107824/comments?limit=50&linked_partitioning=1&client_id=${CLIENT_ID}`
  // const myMock = jest.fn();
  // let mockCs
  beforeEach(() => {
    cs = new CommentStore()
    // mockCs = myMock.bind(cs)
  })
  
  it('初始化,检测属性', () => {
    expect(cs.currentTrack).toBeNull()
    expect(cs.currentTrackComments).not.toBeNull()  
    expect(cs.commentsCount).toBe(0)  
    expect(cs.isLoadingMoreComment).toBe(false)  
    expect(cs.currentCommentNextHref).toEqual('');
  })

  it('@action 设置 currentTrack',  (done)=>{ 
    cs.setCurrentTrack(track)
  
    expect(cs.currentTrack).toEqual(track)
    expect(cs.isLoadingMoreComment).toEqual(false);
    expect(cs.currentCommentNextHref).toEqual('')
    done()
  })

  it('@action submitReplay', async (done) => {
      cs.setCurrentTrack(track)  
      // const bindSetCurrentTrack = myMock.bind(cs)
      // bindSetCurrentTrack(track)
      const user:any={}
      sessionStore.user=user
      await cs.submitReplay(123, 'hyc')
      // expect(cs.isLoadingMoreComment).toEqual(true)      
      // console.log(myMock.mock.calls);
      done()
      const comment = rawData('hyc')
      expect(cs.isLoadingMoreComment).toEqual(false)
      expect(cs.currentTrackComments).not.toBeNull()  
      expect(cs.currentTrackComments.length).toBe(1);
      expect(cs.currentTrackComments.shift()).toEqual(comment)
      done();
  })
  
  it("fetchMoreComments",async (done) => {
    cs.setCurrentTrack(track)
    expect(cs.currentTrackComments.length).toBe(0);
    await cs.fetchMoreComments()
    expect(cs.currentCommentNextHref)
      .toBe(expectNextHref);
    done()
});
 
})