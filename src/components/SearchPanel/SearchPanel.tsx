import * as React from 'react'
const styles = require('./searchpanel.scss')
// import { observable } from 'mobx'
import { observer, inject } from 'mobx-react';
import * as  _ from 'lodash'
import { ITrackStore } from "../../store/TrackStore";
interface ISearchPanelProps {
  TrackStore?: ITrackStore
}

@inject("TrackStore")
@observer
class SearchPanel extends React.Component<ISearchPanelProps, any> {
  handleChange = (value: string) => {
    const store = this.props.TrackStore
    if (store)
      _.debounce(() => store.setFilterTitle(value), 500)();
    else
      console.error("Trackstore is undefined.")
  }
  render() {
    const debounceChange = _.debounce(this.handleChange, 599);
    return (
      <div className={styles.main}>
        <i className='fa fa-search'></i>
        <input type="text" placeholder='Search' onChange={e => (debounceChange(e.target.value))} />
      </div>
    );
  }
}

export default SearchPanel;