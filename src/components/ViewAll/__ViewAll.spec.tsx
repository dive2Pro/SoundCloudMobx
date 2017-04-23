import * as React from 'react'
import ViewAll from './index'
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { UserLink } from '../Links'
const styles = require('./viewall.scss')

describe('ViewAll Component', () => {
  it('初始化渲染', () => {
    const props = {
      clazz: 'TestView',
      count: 12,
      typeContent: 'Texting',
      path: 'href:next',
      id: 11
    }
    const wrapper = shallow(<ViewAll {...props} />);
    expect(toJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find({ className: props.clazz }).length).toBe(1)
    expect(wrapper.find(UserLink).length).toBe(1)
  })
})