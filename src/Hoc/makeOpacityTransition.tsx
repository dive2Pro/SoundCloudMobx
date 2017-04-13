
import * as React from 'react'
import { Component } from 'react'
import { spring, TransitionMotion } from 'react-motion'
interface ImakeOpacityTransitionProp {

}

// todo ,children不好拿
function makeOpacityTransition<Props, State>
  (
  defaultClazz: string,
  datas: any[]
  , Comp: new () => Component<Props, State>) {
  return class makeOpacityTransitionComponent extends Component<Props, State>{

    componentWillMount() {

    }
    getDefaultStyles = () => {

    }
    getStyles = () => {

    }
    willEnter = () => {

    }
    willLeave = () => {

    }
    render() {
      return (
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willEnter={this.willEnter()}
          willLeave={this.willLeave()}
        >
          {
            interpolatedStyles => (
              <Comp />
            )
          }

        </TransitionMotion>
      )
    }
  }

}

export default makeOpacityTransition;