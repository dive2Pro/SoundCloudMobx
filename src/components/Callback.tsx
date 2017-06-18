import * as React from 'react';

export default class Callback extends React.Component<{}, {}> {
  componentDidMount() {
    window.setTimeout(opener.SC.connectCallback, 0);
  }
  render() {
    return <div>This will be close soon!</div>;
  }
}
