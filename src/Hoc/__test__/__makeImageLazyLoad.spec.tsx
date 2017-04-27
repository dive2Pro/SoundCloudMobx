jest.mock('../../services/Fetch.ts')

import * as React from 'react'
import makeImageLazyLoad from '../makeImageLazyLoad'
import { mount } from 'enzyme'
import ToJson from 'enzyme-to-json'
import { Provider, inject } from 'mobx-react'
import { performanceStore } from '../../store';
// import { when, autorun } from 'mobx'
describe('makeImageLazyLoad HOC', () => {
  it('初始化', () => {
    const tempWrapper = ({ src }) => {
      return <img src={src} alt="some test" />
    }
    const Component = makeImageLazyLoad(tempWrapper);
    const props = {
      src: 'name-large'
    }
    const app = (<Provider performanceStore={performanceStore}><Component {...props} /></Provider>)
    const wrapper = mount(app)
    expect(ToJson(wrapper)).toMatchSnapshot()
    // expect(wrapper.find('img').prop('src')).not.toEqual(props.src)
    expect(wrapper.find('img').prop('src')).toEqual('preload.jpg')
  })

  it('检测src的变化', (done) => {
    const tempWrapper = ({ src }) => {

      return <img src={src} alt="some test" />
    }
    const Component: any = makeImageLazyLoad(tempWrapper);
    const props = {
      src: 'http://img3.imgtn.bdimg.com/it/u=4271053251,2424464488&fm=23&gp=0.jpg',
      performanceStore: performanceStore
    }
    /**
     * @link https://github.com/mobxjs/mobx-react/issues/
     */
    const app = (<Component.wrappedComponent {...props} />)
    const wrapper = mount(app)
    expect(ToJson(wrapper)).toMatchSnapshot()
    performanceStore.setCurrentGenre('Test')
    performanceStore.setScrollLimit(0, 128)
    wrapper.update()

    /**
     * omg
     * @link
        *  http://stackoverflow.com/questions/38308214/react-enzyme-test-componentdidmount-async-call/40875174#40875174
     */
    setImmediate(() => {
      expect(wrapper.update().find(tempWrapper).prop("src")).toEqual(props.src)
      expect(ToJson(wrapper)).toMatchSnapshot()
      // 这里在渲染之前执行
      // console.log(wrapper.instance())
      expect(wrapper.instance().imageSrc).toEqual(props.src)
      //
      const newProps = {
        src: 'http://ooul6pnb3.bkt.clouddn.com/23192045-large.jpg',
        size: 50
      }
      //
      wrapper.setProps(newProps)
      setImmediate(() => {

        let expectedSrc = 'http://ooul6pnb3.bkt.clouddn.com/23192045-badge.jpg'
        expect(ToJson(wrapper)).toMatchSnapshot()
        expect(wrapper.instance().imageSrc).toEqual(expectedSrc)
        expect(wrapper.find(tempWrapper).prop('src')).toEqual(expectedSrc)
        done()
      })

      // expect(wrapper.update().find(tempWrapper).prop("src")).toEqual(newProps.src)

    })

  })
})
