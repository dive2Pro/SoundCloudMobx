jest.mock('../../services/Fetch.ts')
import { shallow,mount } from 'enzyme'
import ToJson from 'enzyme-to-json'
import InputRange from './index'
import * as React from "react";
import {createClientXY} from '../../services/EventHelper'
describe('InputRange Component', () => {
  const props = {
    data: 500
  }

  const defualtProps = InputRange.defaultProps
  let defaultTransition = defualtProps.defaultTransition
  let processStyle = {
    width: '0px', height: '100%', backgroundColor: 'chocolate',
    transition: 'width ' + defaultTransition
  }
  let wrapper, instance
  beforeEach(() => {
    wrapper = mount(<InputRange {...props} />)
    instance = wrapper.instance()
  })
  afterEach(() => {
    instance = null;
    wrapper = null;
  })
  it('初始化,测试默认数值', () => {
    expect(ToJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find('div').length).toBe(4)
    expect(instance.valueLimit[1]).toBe(500)
    expect(instance.isVertical).toBe(false)
    expect(instance.positionLimit).toEqual([0, 10])
    expect(instance.gap).toEqual(50)
    expect(instance.ttStyle).toEqual({ visibility: 'hidden' })
    expect(instance.position).toEqual(0)
    expect(instance.currentValue).toEqual(0)
    expect(instance.dotStyle).toEqual(
      {
        transform: `translateX(${0}px)`
        , transition: 'transform ' + defaultTransition
      })

    expect(instance.ProcessStyle).toEqual(processStyle)
    let containerStyle = {
      width: '100%',
      height: '10px',
      backgroundColor: defualtProps.defaultColor
    }
    expect(instance.ContainerStyle).toEqual(containerStyle)

  })

  it('默认 Vertical', () => {
    wrapper.setProps({ vertical: true })
    expect(ToJson(wrapper)).toMatchSnapshot()
    expect(instance.isVertical).toBe(true)
    expect(instance.position).toEqual(10)
    expect(instance.dotStyle).toEqual(
      {
        transform: `translateY(${10}px)`
        , transition: 'transform ' + defaultTransition
      })
    let V_processStyle = {
      ...processStyle, height: '10px', width: '100%', left: '-8.5px',
      transition: 'height ' + defaultTransition, backgroundColor: 'beige'
    }
    expect(instance.ProcessStyle).toEqual(V_processStyle)

    let containerStyle = {
      width: '10px',
      height: '100%',
      backgroundColor: defualtProps.backgroundColor
    }
    expect(instance.ContainerStyle).toEqual(containerStyle)
  })

  it('水平改变value', () => {
    function changeWirdValue(val: number, position: number) {
      let changedValue = val
      instance.setValue(changedValue)
      expect(ToJson(wrapper)).toMatchSnapshot()
      let changedPosition = position
      expect(instance.position).toEqual(changedPosition)
      expect(instance.currentValue).toEqual(changedValue)
      expect(instance.dotStyle).toEqual(
        {
          transform: `translateX(${changedPosition}px)`
          , transition: 'transform ' + defaultTransition
        })
      expect(instance.ProcessStyle).toEqual(
        {
          ...processStyle, width: `${changedPosition}px`, backgroundColor: defualtProps.backgroundColor,
          transition: 'width ' + defaultTransition
        })
    }
    changeWirdValue(0, 0)
    changeWirdValue(25, 0.5)
    changeWirdValue(100, 2)
    changeWirdValue(400, 8)
    changeWirdValue(500, 10)
  })

  it('垂直改变value', () => {
    function changeVerticalValue(val: number, position: number) {
      let changedValue = val
      instance.setValue(changedValue)
      wrapper.setProps({ vertical: true })
      expect(ToJson(wrapper)).toMatchSnapshot()
      let changePosition = position
      expect(instance.position).toEqual(changePosition)
      expect(instance.dotStyle).toEqual(
        {
          transform: `translateY(${changePosition}px)`
          , transition: 'transform ' + defaultTransition
        })
      let V_processStyle = {
        ...processStyle, height: `${changePosition}px`, width: '100%', left: '-8.5px',
        transition: 'height ' + defaultTransition, backgroundColor: 'beige'
      }
      expect(instance.ProcessStyle).toEqual(V_processStyle)
    }
    changeVerticalValue(0, 10)
    changeVerticalValue(25, 9.5)
    changeVerticalValue(100, 8)
    changeVerticalValue(500, 0)

  })

  it("touch Event",()=>{

    let dot = wrapper.find("#dotId");
    dot.simulate("mouseDown");
    expect(ToJson(wrapper)).toMatchSnapshot()
    let instance = wrapper.instance();
    expect(instance.isMoving).toBe(true)

    wrapper.find("#dotId").simulate("mousemove", createClientXY(12,0))
    // expect(instance.position).toEqual(12)
    // todo
  })
})