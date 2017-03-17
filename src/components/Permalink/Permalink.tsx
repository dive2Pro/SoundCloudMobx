import * as React from 'react'
const styles = require('./permalink.scss');
	import * as CSSModule from 'react-css-modules'
export interface IPermalinkProp {
  id: number
  fullname: string
  clazz?:string
}

const Permalink = ({ id,clazz, fullname }: IPermalinkProp) => {
  return <div>
    <a styleName={clazz} href="#" >{fullname}</a>
  </div>
}


export default CSSModule(Permalink,styles);