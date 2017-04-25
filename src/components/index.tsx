import * as React from "react";
import { Redirect } from 'react-router-dom'
import Side from './Header'
import Player from './Player'
import Playerlist from './Playerlist'
import Callback from './Callback'
import Browser from './Browse'
import DashBoard from './DashBoard'
import TrackPager from './TrackPager'
import { PlaylistInfo } from './Playlist'
import { OpacityTransitoinSwitch } from './Switch'
import Loadable from '../Hoc/Loadable'
import LoadingSpinner from './LoadingSpinner';
const styles: any = require('./soundcloud.scss');


class Abadon extends React.PureComponent<any, any>{
  handleTimeout: any;

  state = { time: 5 }
  componentDidMount() {

    this.autoRun();
  }
  componentWillUnmount() {
    if (this.handleTimeout) {
      clearTimeout(this.handleTimeout)
    }
  }

  autoRun = () => {
    setTimeout(() => {
      this.setState((prevState) => {
        if (prevState.time > 0) { this.autoRun() }
        return { time: prevState.time - 1 }
      })
    },
      1000)
  }
  render() {
    return (
      <div style={{ flexBasis:'80%', height: '100vh', background: 'white', textAlign: 'center' }}>
        {this.state.time > -1 ? `${this.state.time} 秒后 跳转到 主页` : <Redirect to={{ pathname: '/main' }} />}
      </div>
    )
  }
}


const routes = [
  {
    exact: true,
    path: '/',
    render: () => {
      return (<Redirect to={{ pathname: '/main' }} />)
    }
  }
  , {
    path: '/main',
    component: Browser
  },
  {
    path: '/users',
    component: DashBoard
    // Loadable({
    // LoadingComponent: LoadingSpinner
    // , loader: () => System.import('./DashBoard')
    // })
  },
  {
    path: '/stream'
    , component: TrackPager
    // Loadable({
    // LoadingComponent: LoadingSpinner
    // , loader: () => System.import('./TrackPager')
    // })
  }
  , {
    path: '/playlist'
    , component: PlaylistInfo
    // Loadable({
    // LoadingComponent: LoadingSpinner
    // , loader: () => System.import('./Playlist/PlaylistInfo')
    // })
  }
  , {
    path: '/callback(:*)',
    component: Callback
  },
  {
    component: Abadon
  }
]


class Main extends React.Component<any, undefined> {
  render() {

    return (
      <div
        className={styles.app}
      >
        <Side />
        <div
          className={styles.fave_div}
        >
          <OpacityTransitoinSwitch
            datas={routes}
            location={this.props.location}
          />
          <Player />
          <Playerlist />
        </div>

      </div>
    );
  }
}
export default Main;
