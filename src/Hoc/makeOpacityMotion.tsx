import * as React from 'react'
import { Component } from "react"
import { Motion, presets, spring } from 'react-motion'
import {observer} from "mobx-react";
interface ImakeOpacityMotionProp {

}
export interface IAddtionalProps {
  additionalStyles?: Object
  className?: string
}
export default function makeOpacityMotion<Props, State>(
  Comp: new () => Component<Props & IAddtionalProps, State>
) {
  @observer
  class makeOpacityMotionWrapper extends Component<Props, any>{
    state = {
      opacity: 0
    }
    componentDidMount() {
      this.setState({ opacity: 1 })
    }
    componentWillReceiveProps(nextProps) {

    }

    componentDidUpdate(prevProps, prevState) {

      if (this.state.opacity == 0 && prevState.opacity == 1) {
        this.setState({ opacity: 1 })
      }
    }


    render() {
      const style = {
        opacity: spring(this.state.opacity, presets.gentle)
      }

      return (
        <Motion style={style}>
          {
            styles => {
              const opacity = styles.opacity;
              const frame = styles.frame
              return (
                <div
                  style={styles}
                  onClickCapture={() => this.setState({ mounted: true })}>

                  <Comp
                    additionalStyles={{
                      opacity,
                      frame: {
                        transform: `transitionX(${frame})`
                      }
                    }}
                    {...this.props}
                  />
                </div>
              )
            }
          }
        </Motion>

      )
    }
  }
  return makeOpacityMotionWrapper
}
