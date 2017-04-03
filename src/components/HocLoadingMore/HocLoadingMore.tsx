import * as React from 'react';
import { Component } from 'react'

interface ET {
  scrollFunc: () => void;
}
interface MyState {
  limit: number[]
}
function HocLoadingMore<Props, State>(
  Comp: new () => Component<Props, State>
) {
  class InnerComponent extends Component<Props & ET, MyState> {
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

        if (trigger) {
          this.props.scrollFunc();
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
        <Comp
          ref={n => this.cpt = n}
          {...this.props}
          {...this.state}
        />
      );
    }
  }
  return InnerComponent;
}

/**
 * 
function HocLoadingMore<Props, State>(
  Comp: new () => Component<Props, State>
) {
  @observer
  class InnerComponent extends Component<Props & ET, MyState> {
    cpt: any;
    div: HTMLDivElement;
    debounceFun: any;
    @observable limit: number[] = [];
    constructor() {
      super()
      this.setLimit(0, 0)
      this.debounceFun = _.debounce(this.handleScrolling, 500);
    }

    handleScrolling = (e: any) => {
      if (window) {
        const trigger = window.innerHeight + window.pageYOffset >= document.body.scrollHeight - 500
        console.log(window.innerHeight
          , window.scrollY
          , window.innerHeight
          // , document.body.offsetHeight
          // , document.body.scrollHeight
        )
        const lowLimit = window.innerHeight + window.scrollY;
        const hightLimit = window.scrollY;
        this.setLimit(lowLimit, hightLimit);
        // console.log(trigger + ' -  loadmore', '---', this.cpt.wrappedInstance)
        if (trigger) {
          this.props.scrollFunc();
        }
      }
    }
    @action setLimit(l: number, h: number) {
      // this.limit.clear();
      console.log(l, h)
      // this.limit.splice(0, this.limit.length, l, h)
      this.limit.push(l, h)
      // this.setState({ limit: [l, h] })
    }
    componentDidMount() {

      window.addEventListener('scroll', this.debounceFun)
    }

    componentWiiUnmount() {
      window.removeEventListener('scroll', this.debounceFun)
    }
    state = { limit: [] }
    render() {
      // const props = this.props

      // const passProps = { props, limit: this.limit }
      // const slimit = this.state.limit;
      // console.log(slimit)
      // mobx does not working with hoc
      const limit = this.limit
      console.info(limit)
      return (
        <Comp
          ref={n => this.cpt = n}
          {...this.props}
          {...this.state, limit}
        />
      );
    }
  }
  return InnerComponent;
}
 */
export default HocLoadingMore;