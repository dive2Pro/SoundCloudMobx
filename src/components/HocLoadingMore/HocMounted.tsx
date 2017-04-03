import * as React from 'react'
import HocLoadingMore from './HocLoadingMore'
// whoa!!
export function HocMounted<Props, ComponentState>(
  Comp: new () => React.Component<Props, ComponentState>, onMounted: () => void
) {
  return class HocWrapper extends (HocLoadingMore<Props, ComponentState>(Comp)) {

  }
}