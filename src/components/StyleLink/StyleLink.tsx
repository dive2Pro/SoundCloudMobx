import * as React from 'react'
import { observer } from 'mobx-react'
import { NavLink } from 'react-router-dom'
const styles = require('./stylelink.scss')

interface IStyleLinkProp {
  to: string | {},
  activeClassName?: string | {}
  activeStyle?: {}
  children?: any
  render?: () => any
}

// const defaultStyle
const StyleLink = observer((prop: IStyleLinkProp) => {
  let { to, activeClassName, activeStyle, children, ...rest } = prop

  return (
    <NavLink
      to={to}
      activeClassName={styles.activeClass}
      activeStyle={activeStyle}
      {...rest}
    >
      {children}
    </NavLink >
  );
}
)

export default StyleLink;