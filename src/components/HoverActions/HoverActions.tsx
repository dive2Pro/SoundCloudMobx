import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import ButtonInline from '../ButtonInline'
import { observer } from 'mobx-react'
const styles = require('./hoveractions.scss')
interface IconfiguType {
  fn?: () => void
  className: string
  activeStyle?: {}
  children?: React.ReactChild
}
interface IHoverActionsProp {
  configurations: IconfiguType[]
  isVisible: boolean;
}

export const Action = (cfg: IconfiguType) => {
  const { fn, className, activeStyle, children } = cfg
  return (<div
    className={styles.btnContainer}
    style={activeStyle}>
    <ButtonInline
      onClick={fn && fn}>
      <i className={className}></i>
      {children}
    </ButtonInline>
  </div>
  )
}

const HoverActions = observer((prop: IHoverActionsProp) => {
  const { isVisible, configurations } = prop;
  let styleName = isVisible ? "active" : 'normal'
  return (
    <div styleName={styleName}>
      {configurations.map((cfg, index) => {
        return <Action
          {...cfg}
          key={index + cfg.className} >

        </Action>
      })}
    </div>
  )
});

export default CSSModule(HoverActions, styles);