import * as  _ from 'lodash'
// import {UserStore} from './UserStore' 
// console.log(typeof UserStore); 
import { observable, ObservableMap } from 'mobx'
import { ITrack } from "../interfaces/interface"; 

class Test{
  @observable name = 'hyc';
  @observable currentTrack: ITrack
  @observable private nextHrefsByTrack = new ObservableMap<string>();
  
}
describe('UserStore.ts', () => {
  it('初始化', () => {
    // expect(userStore.userModel).toBeNull()
    // console.log(Test)
  })
})