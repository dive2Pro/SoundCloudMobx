import * as React from 'react'
const styles = require('./artwork.scss')
import * as CSSModule from 'react-css-modules';
const preImage = require('../../../public/images/preload.jpg')
import { autorun, IReactionDisposer } from 'mobx'
import {
  observer
  , inject
} from 'mobx-react'
import { IPerformanceStore } from '../../store/index';
export interface IArtWorkProps {
  size?: number
  alt?: string
  src: string
  optionalImg?: string,
  clazz?: string
  style?: { width?: any, height?: any }
  PerformanceStore?: IPerformanceStore
  live?: boolean
  onClick?: (e: any) => void
}

@inject('PerformanceStore')
@observer
class ArtWork extends React.Component<IArtWorkProps, any> {
  loadImage: any;

  handlerObserver: IReactionDisposer;
  img: HTMLImageElement;
  retryCount = 3
  constructor() {
    super()
    this.loadImage = new Image()
  }
  componentDidMount() {
    this.loadImage.onload = () => {
      if (this.img) {
        this.img.src = this.loadImage.src
        // 取消观察
        if (!this.props.live) {
          this.handlerObserver()
        }
      }
    }

    this.loadImage.onerror = () => {
      // 出现错误怎么办?  
      if (this.retryCount-- > 0) {
        this.caclImg(this.props.src)
      } else {
        // show broken?
      }
    }

    this.handlerObserver = autorun(() => {
      const { PerformanceStore: ps, src } = this.props
      if (this.img && ps && ps.scrollLimit.length > 0 && src) {
        const [l, h] = ps.scrollLimit
        const y = this.img.y
        const imgHeight = this.img.offsetHeight;
        if ((l === h && y <= l) || (y < l && (y + imgHeight > h))) {
          this.caclImg(src)
        }
      } else if (this.img && !!src === false) {
        this.img.src = preImage
      }
    })
  }

  caclImg = (src: string) => {
    const reg = /-{1}large\.{1}/
    let { size, style } = this.props

    if (src && (size && size <= 50)) {
      src = src.replace(reg, '-badge\.')
    } else if (src && style) {
      // tslint:disable-next-line:radix
      const width = parseInt(style.width)
      const height = parseInt(style.height);

      if (width > 100 || height > 100) {
        const size = Math.max(Math.ceil(width), Math.ceil(height))
        let replace = 't300x300'
        // console.log(size)
        if (size > 300 && size < 500) {
          replace = 'crop'
        } else {
          replace = 't500x500'
        }
        src = src.replace(reg, `-${replace}\.`);
      }
    }
    this.loadImage.src = src

  }
  render() {
    const
      {
         size
        , clazz
        , alt
        , style
        , src, ...rest } = this.props
    return (
      <img
        ref={n => this.img = n}
        className={clazz}
        src={src ? preImage : preImage}
        width={size}
        height={size}
        alt={alt}
        style={style}
        {...rest}
      />
    )
  }
}
export default CSSModule(ArtWork, styles);