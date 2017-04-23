import * as React from 'react'
import { UserLink as Link } from '../Links'
const styles = require('./viewall.scss')
import { transBigMath } from '../../services/utils'
interface IViewALLProp {
  clazz: string
  count: number
  typeContent: string
  path: string
  id: number
}

const ViewALL = (prop: IViewALLProp) => {

  return (
    <div className={styles.base}>
      <div >
        <i className={prop.clazz} />
        <span>{transBigMath(prop.count)}  {prop.typeContent}</span>
      </div >
      <span className={styles.view}>
        <Link
          path={prop.path}
          id={prop.id}
        >
          View all
        </Link>
      </span>
    </div >
  );

}

export default ViewALL;