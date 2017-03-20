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
  handleHoverLeave: (id: number) => void
  handleHover: (id: number) => void
}

const TBodyTr = ({ handleHoverLeave, handleHover, data }: ITBodyTrProp) => {
  const { trackId: id, bodyData, configurations } = data
  const tds = bodyData.map((bitem, i) => {
    const { title, tag, onClick } = bitem;
    const renderNormalDom = (
      <div className={styles.duration}>
        {title}
      </div>
    )


    return (
      <td
        key={i + title}
        onClick={() => {
          console.log(onClick);
          onClick && onClick(id)
        }}
        className={tag && styles.anchor}>
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

  return (<tr className={styles.ttr}
    key={id}
    onMouseLeave={() => handleHoverLeave(id)}
    onMouseEnter={() => handleHover(id)}
  >
    {tds}
  </tr>)
}

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
    return (
      <tbody>
        {arr.map(item => {
          return (
            <TBodyTr
              key={item.trackId}
              data={item}
              handleHoverLeave={this.handleHoverLeave}
              handleHover={this.handleHover}
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