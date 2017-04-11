import * as React from 'react'
const styles = require('./infolist.scss')

export interface IInfoActionModel {
  clazz: string;
  count: string;
  onClickHandle?: () => void;
  clickable?: boolean;
}

export interface IInfoListProp {
  data: IInfoActionModel[];
}

const InfoList = ({ data }: IInfoListProp) => {
  const infos = data.map((item, i) => {
    const { clazz: clz, clickable = true, count, onClickHandle } = item
    const clazz = clz;
    const styleName = clickable ? styles.active : styles.infoitem
    return (
      <div
        className={styleName}
        key={i + clazz + count}
        onClick={(onClickHandle)}>
        <i className={clazz}>{count}</i>
      </div>)
  })

  return (
    <div styleName="container">
      {infos}
    </div>)
}

export default (InfoList);