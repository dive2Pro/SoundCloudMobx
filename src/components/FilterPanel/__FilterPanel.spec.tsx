jest.mock('../../services/Fetch.ts')

import ArtWork from '../ArtWork'
import ButtonInline from '../ButtonInline'

import * as React from 'react'
import FilterPanel from './index'
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';

describe('FilterPanel Component', () => {
  let wrapper
  let props = {
    handleClick: (num) => { },
    tagClass: 'false',
    items: [{ content: 'good', type: 'A' }, { content: 'bad', type: 'D' }],
    activeType: 'A'
  }

  beforeEach(() => {
    wrapper = mount(<FilterPanel {...props} />);
  })


  it('初始化渲染', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
    const btn = wrapper.find(ButtonInline)
    expect(btn.length).toBe(3)

  })
})