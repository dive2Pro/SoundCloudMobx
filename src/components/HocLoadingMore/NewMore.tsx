import * as React from 'react'
import HocLoadingMore from './HocLoadingMore'
interface EnhanceComponentClass {
  limit: number[]
}

export function LimitHocLoadingMore<Props, ComponentState>(
  Comp: new () => React.Component<Props & EnhanceComponentClass, ComponentState>
) {
  return class HocWrapper extends (HocLoadingMore<Props, ComponentState>(Comp)) {

  }
}