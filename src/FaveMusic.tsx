import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import DashBoard from './components/DashBoard/DashBoard'
import Header from './components/Header'
import "./styles/index.scss";
import { Provider } from 'mobx-react';
import { UserStore, TrackStore, PlayerStore } from './store';
require('font-awesome/css/font-awesome.css')

useStrict(true)
const render = () => (
    <Router>
        <Provider
            TrackStore={TrackStore}
            UserStore={UserStore}
            PlayerStore={PlayerStore}>
            <div>
                <Header />
                <Route exact path="/" component={DashBoard} />
                <Route path="/my" component={DashBoard} />
                <Route path="/callback(:*)" component={Callback} />
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