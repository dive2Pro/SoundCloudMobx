import * as React from 'react';

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
          this.props.scrollFunc();
          console.log('I am trigged')
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