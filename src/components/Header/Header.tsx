import * as React from "react";
// import {observable,action} from 'mobx'
import { observer, inject } from "mobx-react";
// import { IUserStore } from "../../store/UserStore";
// import { IUser } from "./interfaces/interface";
import DevTool from 'mobx-react-devtools'


@inject("UserStore")
@observer
class Main extends React.Component<any, undefined> {

  loginIn = () => {
    const { UserStore } = this.props;
    UserStore.login();
  };
  componentDidMount() {
    this.props.UserStore.loadDataFromCookie();
  }

  render() {
    const { user } = this.props.UserStore;
    return (
      <div>
        {
          <button onClick={this.loginIn}>{user ? "Loginout" : 'Login'}</button>
        }
        <DevTool />
      </div>
    );
  }
}
export default Main;
