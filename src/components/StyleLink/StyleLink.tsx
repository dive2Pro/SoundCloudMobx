import * as React from 'react'
import { NavLink } from 'react-router-dom'

const styles = require('./stylelink.scss')

interface IStyleLinkProp {
  to: string | {},
  activeClassName?: string | {}
  activeStyle?: {}
  children?: any
  render?: () => any
  exact?: boolean
}

// const defaultStyle
const StyleLink = (function StyleLink(prop: IStyleLinkProp) {
  let { to, activeClassName, activeStyle, children, ...rest } = prop

  // activeStyle={activeStyle}
  return (
    <NavLink
      to={to}
      activeClassName={styles.activeClass}
      {...rest}
    >
      {children}
    </NavLink >
  );
}
)

export default StyleLink;