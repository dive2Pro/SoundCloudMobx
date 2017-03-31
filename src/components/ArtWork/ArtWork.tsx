import * as React from 'react'
const styles = require('./artwork.scss')
import * as CSSModule from 'react-css-modules';
const preImage = require('../../../public/images/preload.jpg')
import { autorun, IReactionDisposer } from 'mobx'
import {
  observer
  , inject
} from 'mobx-react'
import { IPerformanceStore } from "../../store/index";
// import { logInfo } from '../../services/logger'
export interface IArtWorkProps {
  size: number
  alt?: string
  src: string
  optionalImg?: string,
  clazz?: string
  style?: {}
  PerformanceStore?: IPerformanceStore
}

@inject('PerformanceStore')
@observer
class ArtWork extends React.Component<IArtWorkProps, any> {
  handlerObserver: IReactionDisposer;
  img: HTMLImageElement;

  componentDidMount() {
    this.handlerObserver = autorun(() => {
      const ps = this.props.PerformanceStore
      if (ps && ps.scrollLimit.length > 0) {
        const [l, h] = ps.scrollLimit
        const y = this.img.y
        const imgHeight = this.img.offsetHeight;
        // console.log(l, h, '-------', y, 'imgHeight=' + imgHeight)
        if (y < l && (y + imgHeight > h)) {
          console.log(l, h, '-------', y, 'imgHeight=' + imgHeight)
          this.goToLoadImage()
        }
      }
    })
  }
  //  放在这里显然是不合适的,这样不能按需加载

  handleScroll = (e: any) => {
    // 当图片的位置出现在窗口中才加载

    // 1. 获取图片的top位置
    const imgTop = this.img.y
    // 2. 获取窗口的底部底部位置
    const slideInAt = window.scrollY + window.innerHeight
    // logInfo('scroll', slideInAt, '--', imgTop)
    if (slideInAt > imgTop) {
      // 3. 正在滑动的也不加载
    } else {

    }

  }

  goToLoadImage() {
    const image = new Image()
    image.onload = () => {
      this.img.src = image.src
      this.handlerObserver()
    }

    image.onerror = () => {
      //出现错误怎么办?  todo
    }

    const { src
    } = this.props
    image.src = src
  }
  render() {
    const { size
      , clazz
      , alt, style } = this.props
    const ps = this.props.PerformanceStore
    if (ps) {
      // const [l, h] = ps.scrollLimit
      // console.log(l, h)
    }
    return (
      <img
        ref={n => this.img = n}
        style={style}
        className={clazz}
        src={preImage} width={size} height={size} alt={alt} />
    )
  }
}
export default CSSModule(ArtWork, styles);