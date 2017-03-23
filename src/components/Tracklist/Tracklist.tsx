import * as React from 'react'
// import Tracklistinfo from '../TracklistInfo'
import Activities from '../Activities'
import { inject, observer } from "mobx-react";
import { ITrackStore } from "../../store/TrackStore";
import FilterPanel from '../FilterPanel'
import * as sortTypes from '../../constants/sortTypes'
import SearchPanel from '../SearchPanel'
const styles = require('./tracklist.scss')

interface ITracklistProp {
  prop: ITracklistProp

}



@inject("TrackStore")
@observer
class Tracklist extends React.Component<any, any>  {
  handleSortType = (type: string) => {
    this.props.TrackStore.setSortType(type)
  };

  handleScroll = () => {
    console.log('---')
    const trackStore: ITrackStore = this.props.TrackStore
    const { isLoadingActivities } = trackStore;
    if (!isLoadingActivities)
      trackStore.fetchNextActivities();
  }
  handleFilterType = (type: string) => {
    this.props.TrackStore.setFilterType(type)
  }

  render() {
    const filterProp = {
      handleClick: this.handleFilterType,
      tagClass: 'fa fa-filter',
      items: [
        {
          content: 'ALL',
          type: ""
        }, {
          content: "Track",
          type: 'track'
        }, {
          content: "Mix",
          type: 'mix'
        }],
      activeType: this.props.TrackStore.filterType
    }
    const sortItems = sortTypes.sortObjs.map(item => {
      const key = Object.keys(item)[0]
      return {
        type: sortTypes[key],
        content: item[key]
      }
    })
    const sortProp = {
      handleClick: this.handleSortType,
      tagClass: 'fa fa-sort',
      items: [{
        content: 'NONE',
        type: ''
      }].concat(sortItems),
      activeType: this.props.TrackStore.sortType
    }
    return (
      <div className={styles.main}>
        <div className={styles.types}>
          <FilterPanel {...filterProp} />
          <FilterPanel {...sortProp} />
          <SearchPanel />
        </div>
        {/*<Tracklistinfo />*/}
        <Activities scrollFunc={this.handleScroll} />
      </div>
    )
  }

}

export default Tracklist