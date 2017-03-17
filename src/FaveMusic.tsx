import * as React from 'react';
import * as ReactDOM from 'react-dom'; 
import { useStrict } from 'mobx'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Callback from './components/Callback'
import DashBoard from './components/DashBoard/DashBoard'
import Header from './components/Header/Header'
import "./styles/index.scss";
import { Provider } from 'mobx-react';
import UserStore from './store/UserStore';

useStrict(true);
const render = () => (
    <Router>
        <Provider UserStore={UserStore}>
            <div>
                <Header />
                <Route exact path="/" component={DashBoard} />
                <Route path="/main" component={DashBoard} />
                <Route path="/callback(:*)" component={Callback} />
            </div>
        </Provider>
    </Router>

)
ReactDOM.render(
    render(),
    document.getElementById('root') as HTMLElement
);
// Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./components/index', () => {
        ReactDOM.render(
            render(),
            document.getElementById('root')
        );
    });
}