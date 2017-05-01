import * as React from 'react'
import { Component } from "react"
import { Motion, presets, spring } from 'react-motion'
import {observer} from "mobx-react";

export default function makeTranslateMotion<Props, State>(
  Comp: new () => Component<Props, State>
) {
@observer
    class makeTranslateXMotionWrapper extends Component<any, any>{
    state = {
      mounted: false
    }

    componentDidMount() {
      this.setState({ mounted: true });

    }

    componentWillUnmount() {
      this.setState({ mounted: false })
    }


    componentWillMount() {
      this.setState({ mounted: false })
    }

    render() {
      const style = {
        left: this.state.mounted ? spring(0, presets.gentle) : spring(-200)
      }

      return (
        <Motion
          style={style}
        >
          {
            styles => {
              return (
                <div
                  style={{ ...styles, position: 'relative', minHeight: '100vh' }}
                >
                  <Comp
                    {...this.props}
                  />
                </div>
              )
            }
          }
        </Motion >

      )
    }
  }
  return  makeTranslateXMotionWrapper
}