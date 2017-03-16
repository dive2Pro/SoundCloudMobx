import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Main from './Main'
import {AppContainer} from 'react-hot-loader'
import {useStrict} from 'mobx'
import UserStore from './store/UserStore';
import {Provider} from 'mobx-react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Callback from './components/Callback'

useStrict(true);

ReactDOM.render(
        <Provider UserStore={  UserStore}>
            <Router>
            <div>

                <Route exact path="/" component={Main}/>
            <Route path="/main" component={Main} />
            <Route path="/callback(:*)" component={Callback} />

            </div>
                </Router>
        </Provider>
                ,
  document.getElementById('root') as HTMLElement
);
// Hot Module Replacement API
if ((module as any).hot) {
    (module as any).hot.accept('./Main', () => {
        const NextApp = (require as any)('./Main').default;
        ReactDOM.render(
            <AppContainer>
                <NextApp/>
            </AppContainer>,
            document.getElementById('root')
        );
    });
}