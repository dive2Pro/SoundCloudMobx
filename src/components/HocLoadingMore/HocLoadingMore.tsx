import * as React from 'react';
import { Component } from 'react'

interface ET {
  scrollFunc: () => void;
  children?: React.ReactNode
}
interface MyState {
  limit: number[]
}

function HocLoadingMore<Props, State>(
    Comp:new (Props?: any | undefined, context?: any) => React.Component<Props,any>
) {
  class LoadingMoreWrapper extends Component<Props & ET, MyState> {
    cpt: any;
    div: HTMLDivElement;
    constructor() {
      super()
      this.handleScrolling = this.handleScrolling.bind(this)

    }

    handleScrolling(e: any) {
      if (window) {
        const trigger = window.innerHeight + window.pageYOffset
          >= document.body.scrollHeight - 500

        if (trigger && this.props.scrollFunc) {
          this.props.scrollFunc();
        }
      }
    }

    componentDidMount() {
      window.addEventListener('scroll', this.handleScrolling)
    }

    componentWillUnmount() {
      window.removeEventListener('scroll', this.handleScrolling)
    }
    render() {
      return (
        <Comp
          ref={n => this.cpt = n}
          {...this.props}
          {...this.state}
        />
      );
    }
  }
  return LoadingMoreWrapper;
}

export default HocLoadingMore;