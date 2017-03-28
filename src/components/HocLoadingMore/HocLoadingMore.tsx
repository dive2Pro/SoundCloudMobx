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
      if (window) {
        const trigger = window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 500
        // console.log(window.innerHeight
        //   , window.pageYOffset
        //   , window.screenY
        //   , document.body.offsetHeight
        //   , document.body.scrollHeight)
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
        <Component {...this.props} />
      );
    }
  }
  return InnerComponent;
}
export default HocLoadingMore;