import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import ButtonInline from '../ButtonInline'
import { observer } from 'mobx-react'
const styles = require('./hoveractions.scss')
interface IconfiguType {
  fn: () => void
  className: string
}
interface IHoverActionsProp {
  configurations: IconfiguType[]
  isVisible: boolean;
}

const Action = (cfg: IconfiguType) => {
  const { fn, className } = cfg
  return (
    <ButtonInline onClick={fn}>
      <i className={className}></i>
    </ButtonInline>
  )
}

const HoverActions = observer((prop: IHoverActionsProp) => {
  const { isVisible, configurations } = prop;
  let styleName = isVisible ? "active" : 'normal'
  return (
    <div styleName={styleName}>
      {configurations.map((cfg, index) => {
        return <Action {...cfg} key={index + cfg.className} />
      })}
    </div>
  )
});

export default CSSModule(HoverActions, styles);