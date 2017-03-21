import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./btinline.scss')

interface IButtonInlineProp {
  onClick?: (...args: any[]) => void;
  children?: React.ReactElement<any>
}

const ButtonInline = ({ onClick, children }: IButtonInlineProp) => {

  return (
    <button
      onClick={onClick}
      type="button">
      {children}
    </button>
  );

}

export default CSSModule(ButtonInline, styles);