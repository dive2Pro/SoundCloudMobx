import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./style.scss')
export interface IButtonGhostProps {
  onClick: ((...args: any[]) => void);
  isSmall?: boolean,
  children?: React.ReactElement<any>
}

const ButtonGhost = ({ onClick, isSmall, children }: IButtonGhostProps) => {

  const clazz = isSmall ? "small" : 'normal';
  return (
    <button
      styleName={clazz}
      type='button'
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default CSSModule(ButtonGhost, styles);