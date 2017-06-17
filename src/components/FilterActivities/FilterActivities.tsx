import * as React from 'react';
import Activities from '../Activities';
import FilterPanel from '../FilterPanel';
import SearchPanel from '../SearchPanel';

import {inject, observer} from 'mobx-react';
import * as sortTypes from '../../constants/sortTypes';
import {ActivitiesStore} from '../../store/ActivitiesStore';
import {ACTIVITIES_STORE} from '../../constants/storeTypes';
const styles = require('./filteractivities.scss');

const sortItems = sortTypes.sortObjs.map(item => {
  const key = Object.keys(item)[0];
  return {
    type: sortTypes[key],
    content: item[key]
  };
});

@inject(ACTIVITIES_STORE)
@observer
class FilterActivities extends React.Component<any, any> {
  actStore: ActivitiesStore;
  componentWillMount() {
    this.actStore = this.props[ACTIVITIES_STORE];
  }
  handleSearchValue = (value: string) => {
    this.actStore && this.actStore.setFilterTitle(value);
  };
  handleSortType = (type: string) => {
    this.actStore.setSortType(type);
  };

  handleFilterType = (type: string) => {
    this.actStore.setFilterType(type);
  };

  componentDidMount() {
    this.actStore.fetchNextActivities(true);
  }

  handleScroll = () => {
    this.actStore.fetchNextActivities();
  };

  render() {
    const filterProp = {
      handleClick: this.handleFilterType,
      tagClass: 'fa fa-filter',
      items: [
        {
          content: 'ALL',
          type: ''
        },
        {
          content: 'Track',
          type: 'track'
        },
        {
          content: 'Mix',
          type: 'mix'
        }
      ],
      activeType: this.actStore.filterType
    };
    const sortProp = {
      handleClick: this.handleSortType,
      tagClass: 'fa fa-sort',
      items: [
        {
          content: 'NONE',
          type: ''
        }
      ].concat(sortItems),
      activeType: this.actStore.sortType
    };

    const {
      filteredTracks,
      isLoading,
      sortType,
      currentGenre,
      isError
    } = this.actStore;
    // 这里为了mobx更新
    filteredTracks.length;

    return (
      <div>
        <div className={styles.types}>
          <FilterPanel {...filterProp} />
          <FilterPanel {...sortProp} />
          <SearchPanel
            autoSearch={true}
            handleSearch={this.handleSearchValue}
          />
        </div>
        <Activities
          scrollFunc={this.handleScroll}
          isLoading={isLoading}
          isError={isError(currentGenre)}
          datas={this.actStore.filteredTracks}
          type={sortType}
        />
      </div>
    );
  }
}

export default FilterActivities;
