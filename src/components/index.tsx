import * as React from "react";
// import Header from './Header/Header'
import { Route, Switch } from 'react-router-dom'
import Header from './Header'
import Player from './Player'
import Playerlist from './Playerlist'
import Callback from './Callback'
import DashBoard from './DashBoard'
import Browser from './Browse'
import TrackPager from './TrackPager'
import { PlaylistInfo } from './Playlist'
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
  route: HTMLDivElement;
  render() {
    return (
      <div
        style={{
          display: 'flex', height: '100%', overflow: 'hidden'
          , justifyContent: 'center'
          , position: 'relative'
        }}
      >
        <Header />
        <div
          className={styles.fave_div}
          ref={n => this.route = n}>
          <Switch>
            {
              routes.map((route, i) => (
                <Route
                  key={i}
                  {...route}
                />
              ))
            }
          </Switch>
          <Player />
          <Playerlist />
        </div>

      </div>
    );
  }
}
export default Main;
