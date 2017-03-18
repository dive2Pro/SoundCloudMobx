import * as React from 'react'
import * as CSSModule from 'react-css-modules'
import LoadingSpinner from '../LoadingSpinner';
import ButtonGhost, { IButtonGhostProps } from '../ButtonGhost';
// import { observer } from 'mobx-react'
const styles = require('./btmore.scss')

export interface IButtonMoreProp extends IButtonGhostProps {
  isLoading: boolean
  isHidden?: boolean
}


const ButtonMore = (function ButtonMore(prop: IButtonMoreProp) {
  const { isLoading, isHidden } = prop;
  console.log(isLoading + "---Buttonmore")
  if (isHidden) {
    return <noscript />
  }
  return (
    <div styleName='more'>
      {!isLoading ? <ButtonGhost {...prop} >More </ButtonGhost>
        : <LoadingSpinner isLoading={isLoading} />
      }</div>
  );

})

export default CSSModule(ButtonMore, styles);
