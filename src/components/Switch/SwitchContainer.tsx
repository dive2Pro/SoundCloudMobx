import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { IAddtionalProps } from "../../Hoc/makeOpacityTransition";
import makeTransition from '../../Hoc/makeTransition'

interface ISwitchContainerProps extends IAddtionalProps {
  // location: Object
}

class SwitchContainer extends React.Component<ISwitchContainerProps, any> {
  render() {
    // const { location } = this.context.router
    const { className, interpolatedStyles, children } = this.props
    const styledMaps = React.Children.map(children, (child: any, index) => {
      if (!Object.is(child.type, Route)) {
        console.warn(`SwitchContainer child ${child}-${index} is not Route`);
        return
      }
      const divProps = { path: '', exact: false, strict: false, render: Object };
      ({ path: divProps.path, exact: divProps.exact, strict: divProps.strict, render: divProps.render } = child.props);
      return (style, location) => (
        <div
          key={'SwitchContainer-child - ' + location.url + index}
          style={{ ...style, position: 'relative' }}
          {...divProps}

        >
          {
            divProps.render ? divProps.render(location) : React.createElement(child)
          }
        </div>
      )
    })

    return (
      <Route
        render={({ location }) => (
          <Switch>
            {
              interpolatedStyles && interpolatedStyles.map((item, index) => {
                const { style } = item;
                const child = styledMaps[index]
                return child && child(style, location)
              })
            }
          </Switch>
        )}
      />


    );
  }
}

export default makeTransition(SwitchContainer)