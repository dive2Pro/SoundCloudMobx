import * as React from 'react'
// import Permalink from '../Permalink';
import HoverActions from '../HoverActions'
const styles = require('./table.scss')
console.log(styles);
interface ITableHead {
  title?: string
  width: number
}

export interface ITableBodyItem {
  tag?: string   // 注明跳转的url
  title: string // 展示的
  render?: () => React.ReactElement<any>// 自己渲染
  url?: string
  onClick?: (id: number) => void;
}
export class TableBodyItem implements ITableBodyItem {
  title: string
  tag?: string
  url?: string
  constructor(title: string, tag?: string, url?: string) {
    this.title = title
    this.tag = tag
    this.url = url;
  }
}
export interface ITableBody {
  trackId: number
  singerId: number
  bodyData: ITableBodyItem[]
  configurations: any[]
  live?: boolean
}

export class TableBody {
  trackId: number
  singerId: number
  bodyData: ITableBodyItem[] = [];
  constructor(trackId: number, singerId: number) {
    this.trackId = trackId
    this.singerId = singerId
  }
  updateToBody(item: ITableBodyItem) {
    this.bodyData.push(item);
  }
}
interface ITableProp {
  thead: ITableHead[]
  tbody: ITableBody[]
}

interface ItableHeadProp {
  data: ITableHead[]
}
const Thead = ({ data }: ItableHeadProp) => {

  return (
    <tr>
      {data.map((item, i) => {
        const { title, width } = item
        return (
          <th key={i + "-" + width} width={width + "%"}>
            {title}
          </th>
        )
      })}
    </tr>
  )
}

interface ITBodyTrProp {
  data: ITableBody
}

const TBodyTr = ({ data }: ITBodyTrProp) => {
  const { trackId: id, bodyData, configurations, live } = data
  const tds = bodyData.map((bitem, i) => {
    const { title, tag, onClick } = bitem;

    const renderNormalDom = (<div className={styles.duration}>{title}</div>)
    const anchorClazz = live ? styles.liveanchor : styles.anchor;
    return (
      <td
        key={i + title + '-' + id}
        onClick={() => {
          console.log(onClick);
          onClick && onClick(id)
        }}
        className={tag && anchorClazz}>
        {
          (bitem.render) ?
            bitem.render() : renderNormalDom
        }
        {tag && <div className={styles.actions}>
          <HoverActions
            configurations={configurations}
            isVisible={true} />
        </div>}
      </td>)
  })
  const preKey = UniqueKey[UniqueKey.length - 1].length++;
  return (<tr className={styles.ttr}
    key={id + "-!-" + preKey}
  >
    {tds}
  </tr>)
}
const UniqueKey: any[] = [];

class Tbody extends React.Component<{ arr: ITableBody[] }, any> {
  state = {}
  handleHover = (id: number) => {
    this.setState({
      hoverId: id
    })
  }

  handleHoverLeave = (id: number) => {
    this.setState({
      hoverId: null
    })
  }

  render() {
    const { arr } = this.props;
    UniqueKey[UniqueKey.length++] = [];
    return (
      <tbody>
        {arr.map((item, i) => {
          return (
            <TBodyTr
              key={item.trackId + "--" + i}
              data={item}
            />
          )
        })}
      </tbody>
    )
  }
}

const Table = (prop: ITableProp) => {
  const { thead, tbody } = prop

  return (
    <table>
      <thead>
        <Thead data={thead} />
      </thead>
      <Tbody arr={tbody} />
    </table>
  );

}

export default Table 