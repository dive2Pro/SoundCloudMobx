import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import ButtonInline from '../ButtonInline'
import { observer } from 'mobx-react'
const styles = require('./hoveractions.scss')
interface IconfiguType {
  fn?: () => void
  className: string
  style?: {}
  children?: React.ReactChild
}
interface IHoverActionsProp {
  configurations: IconfiguType[]
  isVisible: boolean;
}

export const Action = (cfg: IconfiguType) => {
  const { fn, className, style, children } = cfg
  return (
    <div
      className={styles.btnContainer}
      style={style}
    >
      <ButtonInline
        onClick={fn && fn}
      >
        <i className={className} />
        {children}
      </ButtonInline>
    </div>
  )
}

const HoverActions = observer(function HoverActions(prop: IHoverActionsProp) {
  const { isVisible, configurations } = prop;
  let styleName = isVisible ? "active" : 'normal'
  return (
    <div styleName={styleName}>
      {configurations.map((cfg, index) => {
        return (
          <Action
            {...cfg}
            key={index + cfg.className}
          />)
      })}
    </div>
  )
});

export default CSSModule(HoverActions, styles);