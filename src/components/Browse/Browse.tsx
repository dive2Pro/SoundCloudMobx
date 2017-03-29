import * as React from 'react'
const styles = require('./browse.scss')
import {
  observer
  // , inject
} from 'mobx-react'
import TrackList from '../Tracklist'
import { Link, Route, Redirect } from 'react-router-dom'
import { GENRES } from '../../constants/trackTypes'
interface IDashBorardProps {
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
        {/* TODO what the hell is this?*/}
        <Redirect to={`/main/genre=${GENRES[0]}`} />
      </div>
    );
  }
}

export default Browse; 