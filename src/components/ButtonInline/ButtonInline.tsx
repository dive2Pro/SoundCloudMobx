import * as React from 'react';
const styles = require('./btinline.scss');

interface IButtonInlineProp {
  onClick?: (...args: any[]) => void;
  children?: React.ReactElement<any>;
  className?: string;
  style?: object;
}

const ButtonInline = ({onClick, children, ...rest}: IButtonInlineProp) => {
  return (
    <button onClick={onClick} {...rest} type="button">
      {children}
    </button>
  );
};

export default ButtonInline;
