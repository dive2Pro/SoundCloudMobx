import * as React from "react";
import { Route, Switch } from 'react-router-dom'
import Side from './Header'
import Player from './Player'
import Playerlist from './Playerlist'
import Callback from './Callback'
import DashBoard from './DashBoard'
import Browser from './Browse'
import TrackPager from './TrackPager'
import { PlaylistInfo } from './Playlist'
import { OpacityTransitoinSwitch } from './Switch'
const styles = require('./favemusic.scss')

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
    render: (match: any) => {
      return (
        <div style={{ minWidth: '89.143em', height: '100vh', background: 'purple' }}>
          Hallo
          </div>)
    }
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
