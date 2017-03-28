import * as React from 'react'
const styles = require('./btghost.scss')
export interface IButtonGhostProps {
  onClick: ((...args: any[]) => void);
  isSmall?: boolean,
  children?: React.ReactElement<any>
}

const ButtonGhost = ({ onClick, isSmall, children }: IButtonGhostProps) => {

  const clazz = isSmall ? styles.small : styles.normal;
  return (
    <button
      className={clazz}
      type='button'
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default (ButtonGhost);