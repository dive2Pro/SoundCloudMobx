import * as React from 'react';
import {NavLink} from 'react-router-dom';

interface IStreamLinkProp {
  id: number;
  children?: any;
  className?: string;
}

const StreamLink = (props: IStreamLinkProp) => {
  const {id, children, ...rest} = props;
  return (
    <NavLink to={{pathname: '/stream', search: `?id=${id}`}} {...rest}>
      {children}
    </NavLink>
  );
};

export default StreamLink;
