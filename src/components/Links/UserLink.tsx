import * as React from 'react'
import { NavLink as Link } from 'react-router-dom'
// const styles = require('./.scss')

interface IRouterLinkProp {
  path: string,
  id: number
  children?: any
  className?: string
}

const RouterLink = (prop: IRouterLinkProp) => {

  return (
    <Link
      to={{
        pathname: `/users/${prop.path}`,
        search: `?id=${prop.id}`
      }}
    >
      {prop.children}
    </Link>
  );

}

export default (RouterLink);