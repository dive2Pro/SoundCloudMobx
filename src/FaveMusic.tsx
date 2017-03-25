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
import { UserStore, TrackStore, PlayerStore, ActivitiesStore } from './store';
require('font-awesome/css/font-awesome.css');
useStrict(true)
// const stores = [ActivitiesStore, UserStore, TrackStore, PlayerStore]
const render = () => (
    <Router>
        <Provider
            ActivitiesStore={ActivitiesStore}
            UserStore={UserStore}
            TrackStore={TrackStore}
            PlayerStore={PlayerStore}
        >
            <div>
                <Header />
                <Switch>
                    <Route exact path="/" component={Browser} />
                    <Route path="/my" component={DashBoard} />
                    <Route path="/main" component={Browser} />
                    <Route path="/callback(:*)" component={Callback} />
                </Switch>
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