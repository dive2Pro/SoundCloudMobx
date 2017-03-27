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
import { Link, Route, Redirect } from 'react-router-dom'
import { GENRES } from '../../constants/trackTypes'
interface IDashBorardProps {
  TrackStore: ITrackStore
  location?: any
}


const FlagLink = ({ to, label }: any) => {
  return <Route path={to} exact={true} children={({ match }: any) => {
    return (<div className={match ? "active" : ""}>
      {match ? <i className='fa fa-flag'></i> : ""}
      <Link to={to} >{label}</Link>
    </div>)
  }}
  />
}

@observer
class Browse extends React.Component<IDashBorardProps, any> {
  public static defaultProps: Partial<IDashBorardProps> = {
  }
  render() {
    // const { } = this.props.location
    return (
      <div className={styles.container}>
        <nav className={styles.nav}>
          {GENRES.map((item, i) => {
            return <FlagLink
              key={i + "-" + item}
              to={`/main/genre=${item}`}
              label={item} />
          })}
        </nav>

        <Route path={`/main/genre=:genre`} component={TrackList} />

        <Redirect to={`/main/genre=${GENRES[0]}`} />
        <Player />
        <Playlist />
      </div>
    );
  }
}

export default Browse; 