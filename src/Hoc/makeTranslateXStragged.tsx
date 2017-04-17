import * as React from 'react'
import { Component } from "react"
import { Motion, presets, spring, StaggeredMotion } from 'react-motion'
import { IAddtionalProps } from './makeTransition'

function AcontainB(a, b): boolean {
  return b.every((item, i) => {
    return a.indexOf(item) > -1;
  }
  )
}
export default function makeTranslateMotion<Props, State>(
  Comp: new () => Component<Props & IAddtionalProps, State>
) {

  return class makeTranslateXMotionWrapper extends Component<any, any>{


    state = {
      datas: []
    }
    reset = false
    componentDidMount() {
      const datas: any = this.props.datas
      this.setState({
        datas: datas.map(this.geneStyles)
      })
    }

    componentWillReceiveProps(nextProps) {
      // 和之前的比对
      console.log(this.props.datas, nextProps.datas);

      if (this.props.datas != nextProps.datas || this.state.datas.length != nextProps.datas.length) {
        this.setState((prevState) => {
          return { datas: nextProps.datas }
        })
        this.reset = true
        if (AcontainB(nextProps.datas, this.props.datas)) {
          this.reset = false
        }
      }
    }
    getDefaultStyles = () => {
      return this.state.datas.map((_, index) => ({ left: -200, opacity: 0 }))
    }

    geneStyles = (item, index, arr) => {
      return index === 0
        ? { left: 0, opacity: 1 } :
        {
          opacity: spring(arr[index - 1].opacity, presets.gentle),
          left: spring(arr[index - 1].left, presets.gentle)
        }
    }
    getStyles = (prevStyles) => {

      const datas = this.state.datas
      const reset = this.reset;
      const geneStyles = this.geneStyles
      function getDiffArr() {
        let diffArr
        if (prevStyles.length < datas.length) {
          diffArr = datas.slice(prevStyles.length, datas.length).map(geneStyles)
        } else {
          // if (prevStyles[0].left !== 0)
          prevStyles = prevStyles.map(geneStyles)
        }
        return diffArr ? prevStyles.concat(diffArr) : prevStyles
      }

      prevStyles = prevStyles.length > 0 && !reset ? getDiffArr() : this.state.datas.map(geneStyles);
      this.reset = false
      return prevStyles
    }

    render() {
      const { datas, isLoading } = this.props

      return isLoading && !this.state.datas.length ?
        <div /> : (
          <StaggeredMotion
            defaultStyles={this.getDefaultStyles()}
            styles={this.getStyles}
            style={{ width: 'inherit', height: 'inherit' }}
          >
            {
              (interpolatedStyles, i) => {
                {/*console.log(interpolatedStyles,*/ }
                {/*this.getStyles(interpolatedStyles)*/ }
                {/*);*/ }
                return (
                  <Comp
                    {...this.props}
                    interpolatedStyles={
                      interpolatedStyles
                    }
                  />
                )
              }
            }
          </StaggeredMotion >
        )
    }
  }
}
