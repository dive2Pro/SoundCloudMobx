import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./btinline.scss')

interface IButtonInlineProp {
  onClick?: (...args: any[]) => void;
  children?: React.ReactElement<any>
  className?: string
}

const ButtonInline = ({ onClick, children, ...rest }: IButtonInlineProp) => {
  return (
    <button
      onClick={onClick}
      {...rest}
      type="button">
      {children}

    </button>
  );

}

export default CSSModule(ButtonInline, styles);