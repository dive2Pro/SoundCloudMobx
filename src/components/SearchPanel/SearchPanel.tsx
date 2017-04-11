import * as React from 'react'
const styles = require('./searchpanel.scss')
import {
  observer
} from 'mobx-react';
import * as  _ from 'lodash'
interface ISearchPanelProps {
  handleSearch: (value: string) => void;
}
@observer
class SearchPanel extends React.Component<ISearchPanelProps, any> {
  handleChange = (value: string) => {
    _.debounce(() => this.props.handleSearch(value), 500)();
  }
  render() {
    const debounceChange = _.debounce(this.handleChange, 599);
    return (
      <div className={styles.main}>
        <i className='fa fa-search' />
        <input type="text" placeholder='Search' onChange={e => (debounceChange(e.target.value))} />
      </div>
    );
  }
}

export default SearchPanel;