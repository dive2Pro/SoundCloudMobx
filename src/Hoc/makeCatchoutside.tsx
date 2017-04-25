/**
 *
 */
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Component} from 'react'
import Any = jasmine.Any;

interface  ICatchOutsideClickCompProps{
    onClick:(b:boolean)=>void
}
interface ICompProps{

    handleTouchOutside?:()=>void;
    ref?:(n)=>any
}
export default function makeCatchoutside<Props, State>(
    Comp:React.ComponentClass<Props&ICompProps>|React.StatelessComponent<Props&ICompProps>
) {
    return class CatchOutSideWrapper extends React.PureComponent<Props & any, any>{
        comp:any
        componentDidMount() {
            document.addEventListener('mousedown', this.onOutsideClick);
        }

        componentWillUnmount() {
            document.removeEventListener('mousedown', this.onOutsideClick);
        }

        onOutsideClick = (event) => {
            console.log(this.comp) //todo 修改 mobx-inject的实现,获取inject的对象组件的state引用,貌似行不通.先睡了
            // 递归检查子组件

            if(!this.comp.state)return

            if(!this.comp.state.isOpen){
                return
            }

            event.preventDefault();
            const local = ReactDOM.findDOMNode(this)
            let target = event.target
            while (target.parentNode) {
                if (target === local) {
                    return
                }
                target = target.parentNode
            }
            if(this.comp.handleTouchOutside)
                this.comp.handleTouchOutside();
        }

        render() {
            return (
                <Comp
                    {...this.props}
                    ref={n=>this.comp=n}
                />
            )
        }
    }
}
