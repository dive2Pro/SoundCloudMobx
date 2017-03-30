
import * as React from 'react'
import Activities from "../Activities";
import FilterPanel from "../FilterPanel";
import SearchPanel from "../SearchPanel";
import { IActivitiesStore } from "../../store/index";
import { inject, observer } from ".4.1.3@mobx-react";
import * as sortTypes from "../../constants/sortTypes";

const styles = require('./filteractivities.scss')



const sortItems = sortTypes.sortObjs.map(item => {
  const key = Object.keys(item)[0];
  return {
    type: sortTypes[key],
    content: item[key]
  };
});
@inject('ActivitiesStore')
@observer
class FilterActivities extends React.Component<any, any> {
  actStore: IActivitiesStore
  componentWillMount() {
    this.actStore = this.props.ActivitiesStore
  }
  handleSearchValue = (value: string) => {

    this.props.ActivitiesStore && this.props.ActivitiesStore.setFilterTitle(value);

  };

  componentDidMount() {
    this.actStore.fetchNextActivities();
  }

  handleScroll = () => {

    const { isLoading } = this.actStore;
    if (!isLoading) this.actStore.fetchNextActivities();
  };
  handleSortType = (type: string) => {
    this.actStore.setSortType(type);
  };

  handleFilterType = (type: string) => {
    this.actStore.setFilterType(type);
  };
  render() {
    const filterProp = {
      handleClick: this.handleFilterType,
      tagClass: "fa fa-filter",
      items: [
        {
          content: "ALL",
          type: ""
        },
        {
          content: "Track",
          type: "track"
        },
        {
          content: "Mix",
          type: "mix"
        }
      ],
      activeType: this.actStore.filterType
    };
    const sortProp = {
      handleClick: this.handleSortType,
      tagClass: "fa fa-sort",
      items: [
        {
          content: "NONE",
          type: ""
        }
      ].concat(sortItems),
      activeType: this.actStore.sortType
    };

    const { filteredTracks, isLoading, sortType } = this.actStore

    return (
      <div>
        <div className={styles.types}>
          <FilterPanel {...filterProp} />
          <FilterPanel {...sortProp} />
          <SearchPanel handleSearch={this.handleSearchValue} />
        </div>
        <Activities
          scrollFunc={this.handleScroll}
          sortType={sortType}
          tracks={filteredTracks}
          isLoading={isLoading}
        />

      </div>
    );
  }
}

export default FilterActivities;