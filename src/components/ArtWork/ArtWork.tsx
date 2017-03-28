import * as React from 'react'
const styles = require('./artwork.scss')
import * as CSSModule from 'react-css-modules'

export interface IArtWorkProps {
  size: number
  alt?: string
  src: string
  optionalImg?: string,
  clazz?: string
  style?: {}
}

const ArtWork = (prop: IArtWorkProps) => {
  const { size, src, clazz, optionalImg, alt, style } = prop
  return (
    <img
      style={style}
      className={clazz}
      src={src || optionalImg} width={size} height={size} alt={alt} />
  )
}
export default CSSModule(ArtWork, styles);