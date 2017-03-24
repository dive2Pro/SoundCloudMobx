import * as React from 'react'
const styles = require('./browse.scss')
import {
  observer
  // , inject
} from 'mobx-react'
import TrackList from '../Tracklist'
// import Activities from '../Activities'
import Player from '../Player'
import Playlist from '../Playlist'
import { ITrackStore } from "../../store";
import { Link, Route } from 'react-router-dom'
interface IDashBorardProps {
  TrackStore: ITrackStore
  location?: any
}

@observer
class Browse extends React.Component<IDashBorardProps, any> {
  public static defaultProps: Partial<IDashBorardProps> = {

  }


  render() {
    return (
      <div className={styles.container}>
        <Link to={'/main/genre=country'}>Country</Link>
        <Link to={'/main/genre=hip-hop'}>Hip&Hop</Link>
        <Link to={'/main/genre=rap'}>Rap</Link>
        <Route path={`/main/genre=:genre`} component={TrackList} />
        <Player />
        <Playlist />
      </div>
    );
  }
}

export default Browse; 