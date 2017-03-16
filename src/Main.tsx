import * as React from "react";
// import {observable,action} from 'mobx'
import { observer, inject } from "mobx-react";
@inject("UserStore")
@observer
class Main extends React.Component<any, any> {
  loginIn = () => {
    const { UserStore } = this.props;
    console.log(UserStore);
    UserStore.login();
  };

  render() {
    const { UserStore } = this.props;
    console.log(UserStore);
    return (
      <div>
        <button onClick={this.loginIn}>Login</button>
      </div>
    );
  }
}
export default Main;
