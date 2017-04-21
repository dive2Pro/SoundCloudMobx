import * as React from 'react'
import TrackTitleView from './index'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StreamLink } from '../Links'
import { Action } from '../HoverActions'

describe('TrackTitleView Component', () => {
  it('初始化渲染', () => {
    const track: any = { title: 'Test---', user: { username: 'haha' } }
    const props = {
      track: track
    }
    const wrapper = shallow(<TrackTitleView {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find(Action).length).toBe(4)
    expect(wrapper.find(StreamLink).length).toBe(1)

  })
})