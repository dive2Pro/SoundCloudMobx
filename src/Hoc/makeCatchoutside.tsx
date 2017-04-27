

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {Component} from 'react'
import Any = jasmine.Any;
import {docMethods} from '../services/docMethos'

interface  ICatchOutsideClickCompProps{
    onClick:(b:boolean)=>void
}
interface ICompProps{
    ref?:(n)=>any
}

function clickOutsideFunc(event){
    if(!this.state)return
    if(!this.state.isOpen){
        return
    }
    event.preventDefault();
    const local = ReactDOM.findDOMNode(this);
    let target = event.target
    let clickOutside=true
    while (target.parentNode) {
        if (target === local) {
            return
        }
        target = target.parentNode
    }
    if(this.handleTouchOutside)
        this.handleTouchOutside();
}

const catchClickOutSideMixin={
    'componentDidMount':function(){
        docMethods.addEvent('mousedown',clickOutsideFunc.bind(this))
    },
    'componentWillUnmount':function(){
        docMethods.removeEvent('mousedown',clickOutsideFunc.bind(this))

    }
}

function patch(target,funcName){
    const base = target[funcName]
    const mixinFunc = catchClickOutSideMixin[funcName]
    const f = !base?mixinFunc:function(){
        base.apply(this,arguments)
        mixinFunc.apply(this,arguments);
    }
    target[funcName]=f
}

export default function makeCatchoutside<Props>
(
    Cons:new (Props?: any | undefined, context?: any) => React.Component<Props,any>
)
{
    if(typeof Cons ==='function'&&(!Cons.prototype||!Cons.prototype.render)&&!React.Component.isPrototypeOf(Cons))
    {
        return makeCatchoutside(
            class tempCons extends Component<Props,any>{
                render() { return Cons.call(this, this.props, this.context); }
            }
        )
    }

    function mixinLifecycleEvents(target){
        [
            'componentDidMount',
            'componentWillUnmount'
        ].forEach(function(funcName){
            patch(target,funcName)
        })
    }
    const target = Cons.prototype||Cons
    mixinLifecycleEvents(target)
    return Cons
}

