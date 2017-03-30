import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import UserItemContainer from '../User'
import { IUserModel } from '../../store'
import { FETCH_FOLLOWINGS } from '../../constants/fetchTypes'
import ButtonMore from '../ButtonMore';
import ViewAll from '../ViewAll';
const styles = require('./followings.scss')
import * as CSSModule from 'react-css-modules'
export interface IFollowersProps {
  UserModel: IUserModel
  history?: any
}
@observer
@CSSModule(styles)
class Followers extends React.Component<IFollowersProps, any> {

  handleMoreClick = () => {
    // const userModel = this.props.UserModel
    // const { nextHrefs } = userModel;
    // const nextHref$ = nextHrefs[FETCH_FOLLOWINGS];
    // userModel.fetchFollowers(nextHref$);
  }
  handleViewAll = () => {
    // console.log('HANDLE view all click')
    this.props.history.push('/user/followers')

  }
  render() {
    const { followings, isLoadings, user } = this.props.UserModel
    const isLoading = isLoadings.get(FETCH_FOLLOWINGS) || false;
    const obj = {
      count: user && user.followings_count,
      clazz: "fa fa-users",
      path: 'followings',
      typeContent: 'followings',
      id: user.id
    }
    const limitFollowings = followings.slice(0, 3);
    return <section styleName='base'>
      <div styleName="top">
        <ViewAll {...obj} />
      </div>
      <div styleName='main'>
        {limitFollowings.map((follower: IUser) => {
          return <UserItemContainer key={follower.id + "-panel"} user={follower} />
        })}
        <ButtonMore isLoading={isLoading} onClick={this.handleMoreClick} />
      </div>
    </section>
  }
}

export default Followers;