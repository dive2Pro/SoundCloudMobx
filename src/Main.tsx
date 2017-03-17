import * as React from "react";
// import {observable,action} from 'mobx'
import { observer, inject } from "mobx-react";
import { IUserStore } from "./store/UserStore";
// import { IUser } from "./interfaces/interface";
import FollowersView from './components/Followers'
import { FETCH_FOLLOWERS } from './constants/fetchTypes'
import DevTool from 'mobx-react-devtools'
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
  renderFollowers = () => {
    const { followers, isLoadings } = this.props.UserStore;
    const fetchFollowersing = isLoadings[FETCH_FOLLOWERS];

    return <FollowersView followers={followers} isLoading={fetchFollowersing} />;

  }
  render() {
    const { user } = this.props.UserStore;
     return (
      <div>
        {
          user ? this.renderFollowers() :
            <button onClick={this.loginIn}>Login</button>
         }
        <DevTool /> 
      </div>
    );
  }
}
export default Main;
