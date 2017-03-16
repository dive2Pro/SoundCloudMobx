import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main'
import {useStrict} from 'mobx'
import UserStore from './store/UserStore';
import {Provider} from 'mobx-react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Callback from './components/Callback'

useStrict(true);
const render = ()=>(
    <Provider UserStore={  UserStore}>
        <Router>
            <div>
                <Route exact path="/" component={Main}/>
                <Route path="/main" component={Main} />
                <Route path="/callback(:*)" component={Callback} />
            </div>
        </Router>
    </Provider>
)
ReactDOM.render(
    render() ,
  document.getElementById('root') as HTMLElement
);
// Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./Main', () => {
         ReactDOM.render(
           render(),
            document.getElementById('root')
        );
    });
}