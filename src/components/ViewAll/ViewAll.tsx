import * as React from 'react'
import * as CSSModule from 'react-css-modules'
// import ButtonInline from '../ButtonInline'
import { Link } from 'react-router-dom'
const styles = require('./viewall.scss')

interface IViewALLProp {
  clazz: string
  count: number
  typeContent: string
  path: string
}

const ViewALL = (prop: IViewALLProp) => {

  return (
    <div
      styleName="base">
      <div >
        <i className={prop.clazz}></i>
        <span>{prop.count}  {prop.typeContent}</span>
      </div >
      <span styleName="view">
        <Link to={`/users/${prop.path}`}> View all</Link></span>
    </div >
  );

}

export default CSSModule(ViewALL, styles);