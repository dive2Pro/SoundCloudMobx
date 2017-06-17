import * as React from 'react';

import {PerformanceStore} from '../../store/PerformanceStore';
import makeImageLazyLoad from '../../Hoc/makeImageLazyLoad';
import {observer} from 'mobx-react';
export interface IArtWorkProps {
  src: string;
  size?: number;
  alt?: string;
  optionalImg?: string;
  clazz?: string;
  style?: {width?: number | string; height?: number | string};
  performanceStore?: PerformanceStore;
  live?: boolean;
  onClick?: (e: Object) => void;
}

const ArtWork = observer((props: IArtWorkProps) => {
  const {size, clazz, alt, style, src, onClick} = props;

  return (
    <img
      className={clazz}
      src={src}
      width={size}
      height={size}
      alt={alt}
      style={style}
      onClick={onClick}
    />
  );
});
export default makeImageLazyLoad(ArtWork);
