import * as React from 'react'

export interface IArtWorkProps {
  size: number
  alt?: string
  src: string
  optionalImg?: string
}
const ArtWork = (prop: IArtWorkProps) => {
  const { size, src, optionalImg, alt } = prop
  return (
    <img src={src || optionalImg} width={size} height={size} alt={alt} />
  )
}
export default ArtWork;