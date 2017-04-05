import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Callback from './components/Callback'
import DashBoard from './components/DashBoard'
import Browser from './components/Browse'
import Header from './components/Header'
import "./styles/index.scss";
import { Provider } from 'mobx-react';
import { UserStore, TrackStore, PlayerStore, SessionStore, ActivitiesStore, CommentStore, PerformanceStore } from './store';
import TrackInfo from './components/Track'
import Player from './components/Player'
import Playerlist from './components/Playerlist'
import { PlaylistInfo } from './components/Playlist'
require('font-awesome/css/font-awesome.css');
useStrict(true)
// const stores = [ActivitiesStore, UserStore, TrackStore, PlayerStore]


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

const render = () => (
    <Router>
        <Provider
            ActivitiesStore={ActivitiesStore}
            UserStore={UserStore}
            TrackStore={TrackStore}
            SessionStore={SessionStore}
            PlayerStore={PlayerStore}
            CommentStore={CommentStore}
            PerformanceStore={PerformanceStore}
        >
            <div style={{ display: 'flex' }}>
                <Header SessionStore={SessionStore} />
                <Switch>
                    {
                        routes.map((route, i) => (
                            <Route
                                key={i}
                                {...route} />
                        ))
                    }
                </Switch>
                <Player />
                <Playerlist />
            </div>
        </Provider>
    </Router>
)
ReactDOM.render(
    render(),
    document.getElementById('root')
);
// Hot Module Replacement API
// if ((module as any).hot) {
//     (module as any).hot.accept('./components/index', () => {
//         ReactDOM.render(
//             render(),
//             document.getElementById('root')
//         );
//     });
// }