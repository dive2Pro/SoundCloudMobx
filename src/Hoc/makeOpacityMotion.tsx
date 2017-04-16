import * as React from 'react'
import { Component } from "react"
import { Motion, presets, spring } from 'react-motion'
interface ImakeOpacityMotionProp {

}
export interface IAddtionalProps {
  additionalStyles?: Object
  className?: string
}
export default function makeOpacityMotion<Props, State>(
  Comp: new () => Component<Props & IAddtionalProps, State>
) {

  return class makeOpacityMotionWrapper extends Component<Props, any>{
    state = {
      mounted: false
    }
    componentWillReceiveProps(nextProps) {
      this.setState({
        mounted: false
      })
    }
    render() {
      const style = {
        opacity: this.state.mounted ? spring(0) : spring(1),
        frame: this.state.mounted ? spring(0) : spring(400)
      }

      return (
        <Motion style={style}>
          {
            styles => {
              const opacity = styles.opacity;
              const frame = styles.frame
              return (
                <div onClickCapture={() => this.setState({ mounted: true })}>

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
}
