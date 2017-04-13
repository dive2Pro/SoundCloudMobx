
import * as React from 'react'
import { Component } from 'react'
import { spring, TransitionMotion, presets } from 'react-motion'
import { observer } from "._mobx-react@4.1.7@mobx-react";

interface ImakeOpacityTransitionProp {
  datas: any[]
  rootClazz?: string,
  itemClazz?: string

}
interface ImakeOpacityTransitionState {
  datas: Object[],
}
export interface IAddtionalProps {
  interpolatedStyles?: { style: Object, key: string, data: Object }[]
  className?: string
}

// todo ,children不好拿
function makeOpacityTransition<Props, State>
  (
  Target: (new () => Component<Props & IAddtionalProps, State>),
  TargetClassName?: string
  ) {

  class makeOpacityTransitionComponent extends Component<Props & ImakeOpacityTransitionProp
    , any>{
    state = {
      datas: new Array<Object>()
    }

    componentDidMount() {
      this.setState({
        datas: this.props.datas.map((item, index) => (
          { ...item, key: `item-${index}` }))
      })
    }

    componentWillReceiveProps(nextProps) {
      this.setState({
        datas: nextProps.datas.map((item, index) => (
          { ...item, key: `item-${index}` }))
      })
    }

    getDefaultStyles = () => {
      return this.state.datas.map((item, index) => {
        return {
          style: {
            height: 0,
            opacity: 1
          },
          item
          , key: `item-${index}`
        }
      })
    }

    getStyles = () => {
      return this.state.datas.map((item, index) => {

        const data = {
          data: item, style: { height: spring(100), opacity: spring(1) }
          , key: `item-${index}`
        }
        return data
      })
    }
    willEnter = () => {
      return {
        height: 0,
        opacity: 0
      }
    }

    willLeave = () => {

    }

    render() {
      return (
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {
            interpolatedStyles => (
              <Target
                {...this.props}
                className={TargetClassName}
                interpolatedStyles={interpolatedStyles}
              />
            )
          }
        </TransitionMotion>
      )
    }
  }
  return makeOpacityTransitionComponent
}

export default makeOpacityTransition;