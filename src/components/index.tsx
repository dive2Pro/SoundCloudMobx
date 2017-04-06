import * as React from "react";
// import Header from './Header/Header'
import { Route, Switch } from 'react-router-dom'
import Header from './Header'
import Player from './Player'
import Playerlist from './Playerlist'
import Callback from './Callback'
import DashBoard from './DashBoard'
import Browser from './Browse'
import TrackInfo from './Track'
import { PlaylistInfo } from './Playlist'


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
    path: '/song'
    , component: TrackInfo
  }
  , {
    path: '/playlist'
    , component: PlaylistInfo
  }
  , {
    path: '/callback(:*)',
    component: Callback
  }, {
    path: '/ssr',
    render: (match: any) => {
      return (<div style={{ height: '100vh', background: 'purple' }}>Hallo</div>)
    }
  }
]


class Main extends React.Component<any, undefined> {
  route: HTMLDivElement;
  render() {
    return (
      <div style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
        <Header />
        <div ref={n => this.route = n}>
          <Switch>
            {
              routes.map((route, i) => (
                <Route
                  key={i}
                  {...route} />
              ))
            }
          </Switch>
        </div>
        <Player />
        <Playerlist />
      </div>
    );
  }
}
export default Main;
