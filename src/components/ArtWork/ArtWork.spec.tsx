import * as React from 'react'
import ArtWork from './index'
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { StreamLink } from '../Links'
import { Action } from '../HoverActions'
import { performanceStore } from '../../store';
import { Provider } from 'mobx-react'

describe('ArtWork Component', () => {
  it('初始化渲染', () => {
    const track: any = { title: 'Test---', user: { username: 'haha' } }
    const props = {
      track: track,
      src: 'http://img4.imgtn.bdimg.com/it/u=1350614941,725003865&fm=23&gp=0.jpg'
    }
    const wrapper = shallow(
      <Provider performanceStore={performanceStore}>
        <ArtWork {...props} />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
    const imgs = wrapper.find('img')
    expect(imgs.length).toBe(0)
    const img = imgs.first()

    // expect(img).toHaveProperty("src", props.src);
  })
})