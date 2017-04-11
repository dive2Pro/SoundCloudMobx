import * as React from 'react'
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
  clazz?: string
}

export const Action = function Action(cfg: IconfiguType) {
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
  let styleName = isVisible ? styles.active : styles.normal
  return (
    <div className={styleName} >
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

export default HoverActions;