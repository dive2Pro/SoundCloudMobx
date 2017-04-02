import * as React from 'react'
import HocLoadingMore from './HocLoadingMore'
import { inject } from 'mobx-react'
const debounce = require('lodash/debounce')
import { IPerformanceStore } from "../../store/index";

interface IE {
  PerformanceStore?: IPerformanceStore
}
// whoa!!
export default function HocMounted<Props, ComponentState>(
  Comp: new () => React.Component<Props, ComponentState>, type?: string
) {
  @inject('PerformanceStore')
  class HocWrapper extends (HocLoadingMore<Props & IE, ComponentState>(Comp)) {
    debounceFun: any;
    constructor() {
      super()
      this.debounceFun = debounce(this.handleEmit, 500);
    }

    componentDidMount() {
      super.componentDidMount()
      if (type) {
        const ps: any = this.props.PerformanceStore
        ps.setCurrentGenre(type);
      }
    }

    handleEmit = () => {
      // const name = Comp.name
      const ps: any = this.props.PerformanceStore

      if (ps) {
        const l = window.innerHeight + window.scrollY
        const h = window.scrollY
        ps.setScrollLimit(l, h);
      }
    }

    handleScrolling(e: any) {
      super.handleScrolling(e)
      this.debounceFun()
    }
  }
  return HocWrapper
}