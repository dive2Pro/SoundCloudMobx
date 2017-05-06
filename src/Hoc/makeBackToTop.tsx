/**
 *
 */
import * as React from 'react'
import * as ReactDOM from "react-dom";

const defaultContainer = {
    position: 'relative' as 'relative'
}
const defaultBackToTopStyle = {
    position: 'fixed' as 'fixed', //https://github.com/Microsoft/TypeScript/pull/10676
    width: 50,
    height: 50,
    right: 0,
    bottom: 50,
    borderRadius: '50%',
    textAlign: 'center'
}

const TagClass = `fa fa-arrow-up fa-2x`;


/**
 * 当页面滑动,显示一个向上的箭头,点击会返回顶部
 * 需要知道:
 *          Comp的顶部位置
 *
 *          Comp的滑动距离
 *
 * @returns {MakeBackToTopWrapper}
 * @param Comp
 */
export default function makeBackToTop<Props>(Comp: new (Props?: any
    | undefined, context?: any) => React.Component<Props, any>) {

    class MakeBackToTopWrapper extends React.Component<Props, any> {
        tag: HTMLElement;
        node: any;
        state={tagVisible:false}
        componentDidMount() {
            const node = this.node = ReactDOM.findDOMNode(this)
            window.addEventListener('scroll', this.handleScroll, false)
            this.tag.addEventListener('click',this.handleScrollTop,false)
        }

        handleScrollTop = () => {
            window.scrollTo({left:0,top:0,behavior:'smooth'});
        }
        handleScroll=()=>{
            const offY = window.pageYOffset||window.scrollY;

            if(offY>50&&!this.state.tagVisible){
                this.setState({tagVisible:true})
            }else if(offY<50){
                this.setState({tagVisible:false})

            }
        }
        componentWillUnmount(){
            this.tag.removeEventListener('click',this.handleScrollTop,false);
            window.removeEventListener('scroll',this.handleScroll,false);
        }
        render() {
            const style = {...defaultBackToTopStyle,display:this.state.tagVisible?"block":'none'};
            return (
                <div
                    style={defaultContainer}
                >
                    <Comp {...this.props}/>
                    <em
                        ref={n=>this.tag=n}
                        style={style}
                        className={TagClass}
                    />

                </div>
            )
        }
    }
    return MakeBackToTopWrapper
}