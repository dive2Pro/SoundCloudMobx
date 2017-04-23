jest.mock('../../services/Fetch.ts')
import * as React from 'react'
import { mount, shallow } from 'enzyme'
import ToJson from 'enzyme-to-json'
import { userStore } from '../../store';
import { Followers as FollowsPanel } from './FollowsPanel'
import UserItemContainer from '../MiniUser'

describe('FollowsPanel Component', () => {
  const props = {
    type: 'namelarge'
  }
  let DubmComponent: any = FollowsPanel
  const app = (<DubmComponent.wrappedComponent {...props} userStore={userStore} />)
  let wrapper

  beforeEach(() => {
    wrapper = shallow(app)
  })

  it('初始化', () => {
    expect(ToJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find('div').length).toBe(0)
  })

  it('改变Userstore 的值', () => {
    const fakeUserModel: any = {
      user: {
      },
      [props.type]: [{ id: 11 }, { id: 22 }, { id: 33 }]
    }
    wrapper.setProps({ isLoading: true })
    userStore.setCurrentUserModel(fakeUserModel)
    expect(wrapper.find('div').length).toBe(0)
    wrapper.setProps({ isLoading: false })
    expect(wrapper.find('div').length).toBe(2)
    expect(wrapper.find(UserItemContainer).length).toBe(3)
    expect(ToJson(wrapper)).toMatchSnapshot()
    // expect(wrapper.find('div').length).not.toBe(0)

  })
})
