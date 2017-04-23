jest.mock('../../services/Fetch.ts')
import ButtonGhost from '../ButtonGhost';
import ArtWork from '../ArtWork'

import * as React from 'react'
import BigUserIcon from './BigUserIcon'
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('BigUserIcon Component', () => {
  let wrapper,
    user: any = { username: 'hyc' }
  let props = {
    handleFollow: (num) => { },
    isFollowing: false,
    user
  }

  beforeEach(() => {
    wrapper = shallow(<BigUserIcon {...props} />);
  })


  it('初始化渲染', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
    const btn = wrapper.find(ButtonGhost)
    expect(btn.length).toBe(1)
    expect(wrapper.find(ButtonGhost).dive().text()).toEqual('FOLLOW')
    expect(wrapper.find(ArtWork).length).toEqual(1)

  })

  it('改变prop', () => {
    wrapper.setProps({ isFollowing: true })
    expect(toJson(wrapper)).toMatchSnapshot()
    const btn = wrapper.find(ButtonGhost)
    expect(wrapper.find(ButtonGhost).dive().text()).toEqual('UNFOLLOW')

  })

})