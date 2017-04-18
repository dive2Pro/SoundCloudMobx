import * as React from "react";
import { Route, Switch, Redirect } from 'react-router-dom'
import Side from './Header'
import Player from './Player'
import Playerlist from './Playerlist'
import Callback from './Callback'
import DashBoard from './DashBoard'
import Browser from './Browse'
import TrackPager from './TrackPager'
import { PlaylistInfo } from './Playlist'
import { OpacityTransitoinSwitch } from './Switch'
const styles = require('./soundcloud.scss')

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
      <div style={{ minWidth: '89.143em', height: '100vh', background: 'white', textAlign: 'center' }}>
        {this.state.time > -1 ? `${this.state.time} 秒后 跳转到 主页` : <Redirect to={{ pathname: '/main' }} />}
      </div>
    )
  }
}


const routes = [
  {
    exact: true,
    path: '/',
    component: Browser
  }
  , {
    path: '/main',
    component: Browser
  },
  {
    path: '/users',
    component: DashBoard
  },
  {
    path: '/stream'
    , component: TrackPager
  }
  , {
    path: '/playlist'
    , component: PlaylistInfo
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
        style={{
          display: 'flex', height: '100%', overflow: 'hidden'
          , justifyContent: 'center'
          , position: 'relative'
        }}
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
