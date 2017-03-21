import * as React from 'react'
import Tracklistinfo from '../TracklistInfo'
import Activities from '../Activities'
import { inject, observer } from "mobx-react";
import { ITrackStore } from "../../store/TrackStore";
const styles = require('./tracklist.scss')

interface ITracklistProp {
  prop: ITracklistProp

}

@inject("TrackStore")
@observer
class Tracklist extends React.Component<any, any>  {

  handleScroll = () => {
    const trackStore: ITrackStore = this.props.TrackStore
    const { isLoadingActivities } = trackStore;
    if (!isLoadingActivities)
      trackStore.fetchNextActivities();
  }

  render() {
    return (
      <div className={styles.main}>
        <Tracklistinfo />
        <Activities scrollFunc={this.handleScroll} />
      </div>
    )
  }

}

export default Tracklist