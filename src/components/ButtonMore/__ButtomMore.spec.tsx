jest.mock('../../services/Fetch.ts')
import LoadingSpinner from '../LoadingSpinner';
import ButtonGhost from '../ButtonGhost';

import * as React from 'react'
import ButtonMore from './index'
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('ArtWork Component', () => {
  let wrapper
  let props = {
    onClick: () => { },
    isLoading: false
  }

  beforeEach(() => {
    wrapper = shallow(<ButtonMore {...props} />);
  })


  it('初始化渲染', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
    const btn = wrapper.find(ButtonGhost)
    expect(btn.length).toBe(1)
    expect(wrapper.find(LoadingSpinner).length).toBe(0)
  })

  it('改变prop', () => {
    wrapper.setProps({ isLoading: true })
    expect(toJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find(LoadingSpinner).length).toBe(1)
    const btn = wrapper.find(ButtonGhost)
    expect(btn.length).toBe(0)
    wrapper.setProps({ isHidden: true })
    expect(wrapper.find(LoadingSpinner).length).toBe(0)
    expect(btn.length).toBe(0)
  })

})