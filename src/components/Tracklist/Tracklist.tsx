import * as React from 'react'
import Tracklistinfo from '../TracklistInfo'
import Activities from '../Activities'
const styles = require('./tracklist.scss')

interface ITracklistProp {
  prop: ITracklistProp

}

class Tracklist extends React.Component<any, any>  {

  render() {
    return (
      <div className={styles.main}>
        <Tracklistinfo />
        <Activities />
      </div>
    )
  }

}

export default Tracklist