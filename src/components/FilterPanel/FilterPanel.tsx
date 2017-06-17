import * as React from 'react';
const styles = require('./filterpanel.scss');
import {observer} from 'mobx-react';
import ButtonInline from '../ButtonInline';
interface IFilterPanelProp {
  handleClick: (type: string) => void;
  tagClass: string;
  items: {
    content: string;
    type: string;
  }[];
  activeType: string;
}
const FilterPanel = observer(
  ({tagClass, activeType, items, handleClick}: IFilterPanelProp) => {
    return (
      <div className={styles.main}>
        <nav className={styles.nav}>
          <ButtonInline onClick={() => handleClick('')}>
            <i className={tagClass} />
          </ButtonInline>
          {items.map((item, index) => {
            return (
              <ButtonInline
                key={index + '-' + item.content}
                onClick={() => handleClick(item.type)}
              >
                <span className={activeType === item.type && styles.active}>
                  {item.content}
                </span>
              </ButtonInline>
            );
          })}
        </nav>
      </div>
    );
  }
);

export default FilterPanel;
