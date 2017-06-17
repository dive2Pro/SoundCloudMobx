import * as React from 'react';
import {NavLink} from 'react-router-dom';

const styles = require('./stylelink.scss');

interface IStyleLinkProp {
  id: string | {};
  children?: any;
}

// const defaultStyle
const StyleLink = function StyleLink(prop: IStyleLinkProp) {
  let {id, children, ...rest} = prop;

  // activeStyle={activeStyle}
  return (
    <NavLink to={{pathname: '/playlist', search: `?id=${id}`}} {...rest}>
      {children}
    </NavLink>
  );
};

export default StyleLink;
