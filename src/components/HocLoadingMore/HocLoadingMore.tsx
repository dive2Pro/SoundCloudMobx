import * as React from 'react';
import * as _ from 'lodash'
function HocLoadingMore(Component: any) {

  class InnerComponent extends React.Component<{ scrollFunc: () => void }, any> {
    div: HTMLDivElement;

    handleScrolling = (e: any) => {
      if (window) {
        const oh = window.pageYOffset,
          sh = this.div.scrollHeight
        const diff = sh - oh
        const trigger = sh > window.outerHeight && sh > oh && diff < 500;
        if (trigger) {
          _.debounce(() => {
            console.log('I am trigged')
            this.props.scrollFunc
          }, 500);
        }
      }
    }
    componentDidMount() {
      window.addEventListener('scroll', this.handleScrolling)
    }

    componentWiiUnmount() {
      window.removeEventListener('scroll', this.handleScrolling)
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