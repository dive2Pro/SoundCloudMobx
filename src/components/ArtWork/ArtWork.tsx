import * as React from 'react'
const styles = require('./artwork.scss')
import * as CSSModule from 'react-css-modules'

export interface IArtWorkProps {
  size: number
  alt?: string
  src: string
  optionalImg?: string,
  clazz?: string
}
const ArtWork = (prop: IArtWorkProps) => {
  const { size, src, clazz, optionalImg, alt } = prop
  return (
    <img
      styleName={clazz}
      src={src || optionalImg} width={size} height={size} alt={alt} />
  )
}
export default CSSModule(ArtWork,styles);