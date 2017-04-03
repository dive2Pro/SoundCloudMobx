import * as React from 'react'
const styles = require('./browse.scss')
import {
  observer
  , inject
} from 'mobx-react'
import TrackList from '../Tracklist'
import {
  Link, Route
  // , Redirect
} from 'react-router-dom'
import { GENRES } from '../../constants/trackTypes'
import { ITrackStore } from "../../store/index";
interface IDashBorardProps {
  location?: any,
  genre?: string
  TrackStore: ITrackStore
  history: any
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
@inject('TrackStore')
@observer
class Browse extends React.Component<IDashBorardProps, any> {
  public static defaultProps: Partial<IDashBorardProps> = {
    genre: GENRES[0]
  }
  componentDidMount() {

    this.setCurrentGenreView()
  }
  setCurrentGenreView() {
    const { TrackStore, history } = this.props
    const genre = TrackStore.currentGenre
    if (genre) {
      history.push(`/main/genre=${genre}`)
    }
  }
  componentWillReceiveProps(nextProps: any) {
    console.info('componentWillReceiveProps', nextProps)
    const { match: { isExact } } = nextProps
    if (isExact) {
      this.setCurrentGenreView()
      // console.log(isExact, '------------')
    }
  }
  componentDidUpdate(prevProps: any) {
    console.info(prevProps)
    if (prevProps.location.pathname !== this.props.location.pathname) {

    }
  }
  componentWillUnmount() {
    console.info('componentWillUnmount')
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
        <Route
          path={`/main/genre=:genre`} component={TrackList} />
        {/*<Redirect></Redirect>*/}
      </div>
    );
  }
}

export default Browse; 