import * as React from "react";
// import {observable,action} from 'mobx'
import { observer, inject } from "mobx-react";
import { IUserStore } from "./store/UserStore";
import { IUser } from "./interfaces/interface";
import FollowersView from './components/Followers'
interface IMainProps {
  UserStore: IUserStore
  s: string
}

@inject("UserStore")
@observer
class Main extends React.Component<IMainProps, undefined> {

  loginIn = () => {
    const { UserStore } = this.props;
    UserStore.login();

  };
  componentDidMount() {
    this.props.UserStore.loadDataFromCookie();
  }
  renderFollowers = (followers: IUser[]) => {

    return <FollowersView followers={followers}/>;

  }
  render() {
    const { user,followers } = this.props.UserStore;

    return (
      <div>
        {
          user ? this.renderFollowers(followers) :
            <button onClick={this.loginIn}>Login</button>
        }
      </div>
    );
  }
}
export default Main;
