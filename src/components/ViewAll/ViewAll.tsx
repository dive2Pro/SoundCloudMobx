import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import ButtonInline from '../ButtonInline'
const styles = require('./viewall.scss')

interface IViewALLProp {
  clazz: string
  count: number
  onClick: () => void
  typeContent: string
}

const ViewALL = (prop: IViewALLProp) => {

  return (
    <div styleName="base">
      <ButtonInline
        onClick={prop.onClick}>
        <i className={prop.clazz}></i>
        <span>{prop.count}  {prop.typeContent}</span>
      </ButtonInline>
      <span styleName="view"> View all</span>
    </div>
  );

}

export default CSSModule(ViewALL, styles);