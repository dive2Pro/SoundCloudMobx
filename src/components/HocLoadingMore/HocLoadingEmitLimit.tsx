import * as React from 'react'
import HocLoadingMore from './HocLoadingMore'
import { inject } from 'mobx-react'
import { PerformanceStore } from "../../store/PerformanceStore";
import { PERFORMANCE_STORE } from "../../constants/storeTypes";
const debounce = require('lodash/debounce')

interface IE {
  performanceStore?: PerformanceStore
}
export default function HocLoadingEmitLimit<Props, ComponentState>(
  Comp: new () => React.Component<Props, ComponentState>, type?: string
) {
  @inject(PERFORMANCE_STORE)
  class HocWrapper extends HocLoadingMore<Props & IE, ComponentState>(Comp) {
    debounceFun: any;
    constructor() {
      super()
      this.debounceFun = debounce(this.handleEmit, 500);
    }

    componentDidMount() {
      super.componentDidMount()
      if (type) {
        const ps: any = this.props.performanceStore
        ps.setCurrentGenre(type);
      }
    }

    handleEmit = () => {
      const ps: any = this.props.performanceStore

      if (ps) {
        const l = window.innerHeight + window.scrollY
        const h = window.scrollY
        ps.setScrollLimit(l, h);
      }
    }
    emitScrollY = () => {
      const ps: any = this.props.performanceStore

      if (ps) {
        ps.setScrollY(window.scrollY);
      }
    }

    handleScrolling(e: any) {
      super.handleScrolling(e)
      this.debounceFun()
      this.emitScrollY();
    }
  }
  return HocWrapper
}