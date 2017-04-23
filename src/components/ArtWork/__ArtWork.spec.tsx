jest.mock('../../services/Fetch.ts')

import * as React from 'react'
import ArtWork from './index'
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { performanceStore } from '../../store';
import { Provider } from 'mobx-react'

describe('ArtWork Component', () => {
  const track: any = { title: 'Test---', user: { username: 'haha' } }
  let props = {
    track: track,
    src: 'http://img4.imgtn.bdimg.com/it/u=1350614941,725003865&fm=23&gp=0.jpg'
  }
  beforeEach(() => {

  })
  it('初始化渲染', () => {
    const wrapper = mount(
      <Provider performanceStore={performanceStore}>
        <ArtWork {...props} />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
    const imgs = wrapper.find('img')
    expect(imgs.length).toBe(1)
    const img = imgs.first()
    expect(img.prop('src')).not.toEqual(props.src);
    expect(img.prop('width')).toBeUndefined()
    expect(img.prop('height')).toBeUndefined()

  })
  it('所有的属性', () => {
    const style = { width: '100px' }
    props = { ...props, size: 50, style }

    const wrapper = mount(
      <Provider performanceStore={performanceStore}>
        <ArtWork {...props} />
      </Provider>
    );
    expect(toJson(wrapper)).toMatchSnapshot()
    const imgs = wrapper.find('img')
    const img = imgs.first()
    expect(img.prop('width')).toEqual(50)
    expect(img.prop('height')).toEqual(50)
    expect(img.prop('style')).toEqual(style)

  })

  it('改变props', (done) => {
    props = { ...props, size: 50 }
    let DubmArtWork: any = ArtWork
    const wrapper = mount(<DubmArtWork.wrappedComponent performanceStore={performanceStore} />
    );
    expect(toJson(wrapper)).toMatchSnapshot()

    let newProps = {
      ...props, src: 'http://ooul6pnb3.bkt.clouddn.com/23192045-large.jpg',
    }
    wrapper.setProps(newProps)
    setImmediate(() => {
      let expectedSrc = 'http://ooul6pnb3.bkt.clouddn.com/23192045-badge.jpg'

      const imgs = wrapper.find('img')
      const img = imgs.first()
      expect(img.prop('src')).toEqual(expectedSrc)
      done()
    })

  })
})