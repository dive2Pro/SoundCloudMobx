import * as React from 'react'
import { Switch, Route } from 'react-router-dom'
import { IAddtionalProps } from '../../Hoc/makeOpacityTransition';

interface ISwitchDefaultProps extends IAddtionalProps {
  location: Object
}

class SwitchDefault extends React.Component<ISwitchDefaultProps, any> {
  render() {
    const { className, interpolatedStyles, children } = this.props
    return (
      <Switch>
        {
          interpolatedStyles && interpolatedStyles.map((item, i) => {
            const route = item.data
            return (
              <div
                key={'SwitchDefault - ' + item.key + ' i ' + i}
                {...route}
                style={item.style}
              >
                <Route
                  location={this.props.location}
                  key={i}
                  {...route}
                />
              </div>)
          })
        }
      </Switch>
    );
  }
}

export default SwitchDefault 