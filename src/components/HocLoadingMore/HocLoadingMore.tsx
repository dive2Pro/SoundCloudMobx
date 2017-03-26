import * as React from 'react';
import { ComponentClass } from 'react'
import * as _ from 'lodash'

interface ET {
  scrollFunc: () => void;
}

function HocLoadingMore<T>(Component: ComponentClass<T>) {

  class InnerComponent extends React.Component<T & ET, any> {
    div: HTMLDivElement;
    constructor() {
      super()
      this.debounceFun = _.debounce(this.handleScrolling, 500);
    }
    debounceFun: any
    handleScrolling = (e: any) => {
      if (window && window.pageYOffset && this.div) {
        const oh = window.pageYOffset,
          sh = this.div.scrollHeight
        const diff = sh - oh
        const trigger = sh > window.outerHeight && sh > oh && diff < 500;
        if (trigger) {
          this.props.scrollFunc();
        }
      }
    }
    componentDidMount() {
      window.addEventListener('scroll', this.debounceFun)
    }

    componentWiiUnmount() {
      window.removeEventListener('scroll', this.debounceFun)
    }

    render() {
      return (
        <div ref={r => this.div = r}>
          <Component {...this.props} />
        </div>
      );
    }
  }
  return InnerComponent;
}
export default HocLoadingMore;