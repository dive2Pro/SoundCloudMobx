import { CommentStore } from './CommentStore'
import {observable,computed} from 'mobx'
class Box {
    @observable uninitialized:any;
    @observable height = 20;
    @observable sizes = [2];
    @observable someFunc = function () { return 2; }
  
    @computed public get width() {
        return this.height * this.sizes.length * this.someFunc() * (this.uninitialized ? 2 : 1);
    }
  
}

describe('CommentStore', () => {
  let cs:CommentStore
  beforeEach(() => {
    cs = new CommentStore()
  })
  it('初始化', () => {
    expect(cs.currentTrack).toBeNull()
    
  })
  it('添加评论到头部', () => {
    // const data = {name:'hyc'}
    // cs.pushLastReplay(data)
    // expect(cs.currentTrackComments).not.toBeNull()
    const b = new Box()
    // expect(b.width).not.toBeNull()
    console.log(b.width)
  })
})