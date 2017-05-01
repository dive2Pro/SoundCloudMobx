import * as React from 'react'
import {inject, observer} from 'mobx-react'
import {action, autorun, IReactionDisposer, observable, toJS, whyRun} from 'mobx'
import {PERFORMANCE_STORE} from '../constants/storeTypes';
import {PerformanceStore} from '../store/PerformanceStore';
import * as ReactDOM from 'react-dom'

const preImage = require('../../public/images/preload.jpg')

interface IMakeImageLazyLoadWrapperProps {
    src: string
    performanceStore: PerformanceStore
    live: boolean
    size: number
    style: { width?: any, height?: any }
}
const asyncLoadImage = (src) => {
    const loadImage = new Image()
    return new Promise((resolve, reject) => {
        loadImage.onload = () => {
            resolve(loadImage.src)
        }
        loadImage.onerror = (err) => {
            reject(err)
        }
        loadImage.src = src
    })
}

const makeCancelable = (promise) => {
    let canceled = false

    const p = new Promise((resolve, reject) => {
        promise.then(data => {
            canceled ? reject({canceled}) : resolve(data)
        }).catch(err => {
            canceled ? reject({canceled}) : reject(err)
        })
    })
    return {
        promise: p,
        cancel(){
            canceled = true
        }
    }
}


function makeImageLazyLoad<Props, State>(Comp: React.ComponentClass<Props & { src: string }> | React.StatelessComponent<
    Props
    & { src: string }>): React.ComponentClass<Props> {
    @inject(PERFORMANCE_STORE)
    @observer
    class MakeImageLazyLoadWrapper extends React.PureComponent<Props & IMakeImageLazyLoadWrapperProps, {}> {
        handlerObserver: IReactionDisposer;
        imgPath: HTMLImageElement;
        retryCount = 3
        @observable imageSrc = preImage

        componentDidMount() {
            const imgNode = ReactDOM.findDOMNode(this)

            this.handlerObserver = autorun(() => {
                const {performanceStore: ps, src} = this.props

                if (ps && ps.scrollLimit.length > 0 && src) {
                    const [l, h] = ps.scrollLimit
                    const y = imgNode.y || 0
                    const imgHeight = imgNode.offsetHeight;
                    if ((l === h && y <= l) || (y < l && (y + imgHeight > h))) {
                        this.caclImg(src)

                    }
                } else if (imgNode && !!src === false) {
                    this.changeImagePath(src)
                }
            })
        }


        /**
         * 根据给定的size 转换 特定大小的图片地址
         */
        caclImg = (src: string, newSize?: number) => {
            const reg = /(-large)\./g
            let {size, style} = this.props
            size = newSize ? newSize : size
            if (src && (size && size <= 50)) {
                src = src.replace(reg, '-badge\.')
            } else if(size>100) {
                let width = size, height = size
                let replace
                if (style) {
                    width = parseInt(style.width, 10)
                    height = parseInt(style.height, 10);
                }

                size = Math.max(Math.ceil(width), Math.ceil(height))
                if (size < 300) {
                    replace = 't300x300'
                } else if (size > 300 && size < 500) {
                    replace = 'crop'
                } else  {
                    replace = 't500x500'
                }
                src = src.replace(reg, `-${replace}\.`);
            }
            this.setImagePath(src)

        }
        promiseLoading
        setImagePath = (src) => {
            const {live} = this.props
            this.promiseLoading = makeCancelable(asyncLoadImage.call(this, src));
            this.promiseLoading.promise
                .then(path => {
                    this.changeImagePath(src)
                    if (!!src&&this.handlerObserver && !live) {
                        this.handlerObserver()
                    }
                })
                .catch(err => {
                    if (!err.canceled && this.retryCount-- > 0) {
                        this.caclImg(src)
                        console.log(err)
                    }
                })

        }
        @action changeImagePath = (path) => {
            this.imageSrc = path||preImage
        }

        @action componentWillUnmount() {
            if (this.promiseLoading) {
                this.promiseLoading.cancel()
            }
            this.imageSrc = toJS(this.imageSrc)
        }

        componentWillReceiveProps(nextProps) {
            if (!!nextProps.src && nextProps.src !== this.imageSrc) {
                this.caclImg(nextProps.src, nextProps.size)
            }
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (nextProps.src && nextProps.length === 1 && this.imageSrc !== nextProps.src) {
                this.caclImg(nextProps.src)
                return false
            }
            return true
        }


        render() {
            return (
                <Comp
                    {...this.props}
                    src={this.imageSrc}
                />
            )
        }
    }
    return MakeImageLazyLoadWrapper
}

export default makeImageLazyLoad