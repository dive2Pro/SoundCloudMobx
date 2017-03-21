import * as React from 'react'
import * as CSSModule from 'react-css-modules'
const styles = require('./filterpanel.scss')
import { observer } from 'mobx-react';
import ButtonInline from '../ButtonInline'
import { ITrackStore } from "../../store/TrackStore";
interface IFilterPanelProp {
  store: ITrackStore
}
const FilterPanel = observer(({ store }: IFilterPanelProp) => {

  const { filterType } = store
  return (
    <div className={styles.main}>
      <nav className={styles.nav}>
        <ButtonInline onClick={() => store.setFilterType('')}>
          <i className='fa fa-filter'></i>
        </ButtonInline>
        <ButtonInline
          onClick={() => store.setFilterType('track')}>
          <span className={filterType == 'track' && styles.active}>
            Track
          </span>
        </ButtonInline>
        <ButtonInline
          onClick={() => store.setFilterType('mix')}>
          <span className={filterType == 'mix' && styles.active}>
            MIX
          </span>
        </ButtonInline>
      </nav>
    </div>
  );
})

export default CSSModule(FilterPanel, styles);