import * as React from 'react'
import { Link } from 'react-router-dom'
// import * as CSSModule from 'react-css-modules'
// const styles = require('./.scss')

interface IRouterLinkProp {
  path: string,
  id: number
  children?: any
}

const RouterLink = (prop: IRouterLinkProp) => {

  return (
    <Link to={{
      pathname: `/users/${prop.path}`,
      search: `?id=${prop.id}`
    }}
    >
      {prop.children}
    </Link>
  );

}

export default (RouterLink);