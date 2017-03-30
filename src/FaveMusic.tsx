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
import { UserStore, TrackStore, PlayerStore, SessionStore, ActivitiesStore, CommentStore } from './store';
import TrackInfo from './components/Track'
import Player from './components/Player'
import Playerlist from './components/Playerlist'
import { PlaylistInfo } from './components/Playlist'
require('font-awesome/css/font-awesome.css');
useStrict(true)
// const stores = [ActivitiesStore, UserStore, TrackStore, PlayerStore]
const render = () => (
    <Router>
        <Provider
            ActivitiesStore={ActivitiesStore}
            UserStore={UserStore}
            TrackStore={TrackStore}
            SessionStore={SessionStore}
            PlayerStore={PlayerStore}
            CommentStore={CommentStore}
        >
            <div>
                <Header SessionStore={SessionStore} />
                <Switch>
                    <Route exact path="/" component={Browser} />
                    <Route path="/main" component={Browser} />
                    <Route path="/users" component={DashBoard} />
                    <Route path="/song" component={TrackInfo} />
                    <Route path='/playlist' component={PlaylistInfo} />
                    <Route path="/callback(:*)" component={Callback} />
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