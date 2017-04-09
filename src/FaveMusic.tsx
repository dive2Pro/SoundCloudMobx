import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useStrict } from 'mobx'
import "./styles/index.scss";
import { Provider } from 'mobx-react';
import {
    userStore
    , TrackStore
    , PlayerStore
    , sessionStore
    , activitiesStore
    , commentStore
    , PerformanceStore
} from './store';
require('font-awesome/css/font-awesome.css');
useStrict(true)
import { BrowserRouter as Router } from 'react-router-dom'
import App from './components'
// const stores = [ActivitiesStore, userStore, TrackStore, PlayerStore]

const render = () => (
    <Router>
        <Provider
            activitiesStore={activitiesStore}
            sessionStore={sessionStore}
            commentStore={commentStore}
            userStore={userStore}

            TrackStore={TrackStore}
            PlayerStore={PlayerStore}
            PerformanceStore={PerformanceStore}
        >
            <App />
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