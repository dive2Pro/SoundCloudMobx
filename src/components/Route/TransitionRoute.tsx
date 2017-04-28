import * as React from 'react'
import makeTranslateXMotion from '../../Hoc/makeTranslateXMotion'
import { Route } from 'react-router-dom'
interface ITransitionRouteProp {
  computedMatch?: object, // private, from <Switch>
  path?: string,
  exact?: boolean,
  strict?: boolean,
  component?: (match?: any) => JSX.Element,
  render?: (match?: any) => JSX.Element,
  location?: object,
}

@makeTranslateXMotion
class TransitionRoute extends React.PureComponent<ITransitionRouteProp, any>{

  render() {

    return (
      <Route {...this.props} />
    );
  }
}

export default (TransitionRoute);