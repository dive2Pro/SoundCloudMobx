import * as React from 'react';
const styles = require('./homelink.scss');

import UserLink from './UserLink';
export interface IHomelinkProp {
  id: number;
  clazz?: string;
  children?: any;
}

const Homelink = ({id, clazz, children}: IHomelinkProp) => {
  clazz = styles[clazz || 0];
  return (
    <UserLink path={'home'} id={id}>
      {children}
    </UserLink>
  );
};

export default Homelink;
