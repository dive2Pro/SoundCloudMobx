import * as React from 'react'
const styles = require('./dashboard.scss')
import Profile from '../Profile/Profile';
import { observer, inject } from 'mobx-react'
import { IUserStore } from '../../store/UserStore'
import FollowersContainer from '../Followers'
import FollowingsContainer from '../Followings'
import { IActivitiesStore, IPlayerStore } from "../../store";
import Activities from "../Activities";
import Favorites from "../Favorites";
import FilterPanel from "../FilterPanel";
import * as sortTypes from "../../constants/sortTypes";
import SearchPanel from "../SearchPanel";
interface IDashBorardProps {
  UserStore: IUserStore
  ActivitiesStore: IActivitiesStore
  PlayerStore: IPlayerStore
}
@inject("UserStore", "ActivitiesStore", 'PlayerStore')
@observer
class DashBorard extends React.Component<IDashBorardProps, any> {
  componentDidMount() {
    // const { ActivitiesStore } = this.props
    // if (ActivitiesStore)

  }

  handleSearchValue = (value: string) => {
    this.props.ActivitiesStore.setFilterTitle(value);
  };

  handleScroll = () => {
    const actsStore: IActivitiesStore = this.props.ActivitiesStore;
    const { isLoading } = actsStore;
    if (!isLoading) actsStore.fetchNextActivities();
  };
  handleSortType = (type: string) => {
    this.props.ActivitiesStore.setSortType(type);
  };



  handleFilterType = (type: string) => {
    this.props.ActivitiesStore.setFilterType(type);
  };
  render() {
    const userStore = this.props.UserStore;
    const actsStore = this.props.ActivitiesStore;
    const { user } = userStore;
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
      activeType: this.props.ActivitiesStore.filterType
    };
    const sortItems = sortTypes.sortObjs.map(item => {
      const key = Object.keys(item)[0];
      return {
        type: sortTypes[key],
        content: item[key]
      };
    });
    const sortProp = {
      handleClick: this.handleSortType,
      tagClass: "fa fa-sort",
      items: [
        {
          content: "NONE",
          type: ""
        }
      ].concat(sortItems),
      activeType: this.props.ActivitiesStore.sortType
    };
    const { filteredTracks: tracks, isLoading, sortType } = actsStore
    return (
      <div className={styles.container}>

        <div className={styles.main}>
          <div className={styles.types}>
            <FilterPanel {...filterProp} />
            <FilterPanel {...sortProp} />
            <SearchPanel handleSearch={this.handleSearchValue} />
          </div>
          {/*<Tracklistinfo />*/}
          <Activities
            scrollFunc={this.handleScroll}
            sortType={sortType}
            tracks={tracks} isLoading={isLoading} />
        </div>
        <aside className={styles.aside}>
          <Profile user={user} />
          <Favorites
            PlayerStore={this.props.PlayerStore}
            UserStore={userStore} />
          <FollowersContainer UserStore={userStore} />
          <FollowingsContainer UserStore={userStore} />
        </aside>

      </div>
    );
  }
}


export default (DashBorard);