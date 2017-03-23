import * as React from 'react';
import * as _ from 'lodash'
function HocLoadingMore(Component: any) {

  class InnerComponent extends React.Component<{ scrollFunc: () => void }, any> {
    div: HTMLDivElement;
    constructor() {
      super()
      this.debounceFun = _.debounce(this.handleScrolling, 500);
    }
    debounceFun: any
    handleScrolling = (e: any) => {
      if (window) {
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
          <Component />
        </div>
      );
    }
  }
  return InnerComponent;
}
export default HocLoadingMore;