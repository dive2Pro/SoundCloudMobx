import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./infolist.scss')

export interface IInfoActionModel {
  clazz: string;
  count: number;
  onClickHandle?: () => void;
  clickable?: boolean;
}

export interface IInfoListProp {
  data: IInfoActionModel[];
}

const InfoList = ({ data }: IInfoListProp) => {
  /*
    const handleClick = (listener:()=>void) => {
      return () => {
        listener();
      }
    }*/
  const infos = data.map((item, i) => {
    const { clazz: clz, clickable = true, count, onClickHandle } = item
    const clazz = clz;
    const styleName = clickable ? "active" : "infoitem"
    return <div
      styleName={styleName}
      key={i + clazz + count}
      onClick={(onClickHandle)}>
      <i className={clazz}>{count}</i>
    </div>
  })

  return (<div styleName='container'>
    {infos}
  </div>)

}

export default CSSModule(InfoList, styles);