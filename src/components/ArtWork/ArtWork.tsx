import * as React from 'react'
const preImage = require('../../../public/images/preload.jpg')

import { PerformanceStore } from '../../store/PerformanceStore';
import makeImageLazyLoad from '../../Hoc/makeImageLazyLoad'
export interface IArtWorkProps {
  src: string
  size?: number
  alt?: string
  optionalImg?: string,
  clazz?: string
  style?: { width?: any, height?: any }
  performanceStore?: PerformanceStore
  live?: boolean
  onClick?: (e: any) => void
}

const ArtWork = (props: IArtWorkProps) => {
  const { size
    , clazz
    , alt
    , style
    , src, onClick } = props

  return (
    <img
      className={clazz}
      src={src}
      width={size}
      height={size}
      alt={alt}
      style={style}
      onClick={onClick}
    />
  )
}
export default makeImageLazyLoad(ArtWork);