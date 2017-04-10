import * as React from 'react'
const styles = require('./permalink.scss');
// import * as CSSModule from 'react-css-modules'
import { Link } from 'react-router-dom'
export interface IPermalinkProp {
  id: number
  fullname: string
  clazz?: string
}

const Permalink = ({ id, clazz, fullname }: IPermalinkProp) => {
  clazz = styles[clazz || 0]
  return (
    <Link
      className={clazz}
      to={{ pathname: '/users/home', search: `?id=${id}` }}
    >{fullname}
    </Link>)
}

export default (Permalink);