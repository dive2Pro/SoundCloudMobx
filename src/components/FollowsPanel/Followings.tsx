import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import UserItemContainer from '../User'
import { IUserModel } from '../../store'
// import { FETCH_FOLLOWINGS, FETCH_FOLLOWERS } from '../../constants/fetchTypes'
import ButtonMore from '../ButtonMore';
import ViewAll from '../ViewAll';
const styles = require('./followings.scss')
import * as CSSModule from 'react-css-modules'

export enum FollowType {
  FOLLOWINGS,
  FOLLOWERS
}

export interface IFollowersProps {
  UserModel: IUserModel
  history?: any,
  type: FollowType
}
@observer
@CSSModule(styles)
class Followers extends React.PureComponent<IFollowersProps, any> {

  // TODO refacotror for repeart this with follower  
  render() {
    const { UserModel: um, type: t } = this.props
    const type = FollowType[t].toLowerCase();
    const { user } = um
    const users = um[type];
    const isLoading = um.isLoading(type)
    const obj = {
      count: user && user[`${type}_count`],
      clazz: "fa fa-users",
      path: type,
      typeContent: type,
      id: user && user.id
    }
    const limitUsers = users.slice(0, 3);
    return <section styleName='base'>
      <div styleName="top">
        <ViewAll {...obj} />
      </div>
      <div styleName='main'>
        {limitUsers.map((follower: IUser) => {
          return <UserItemContainer key={follower.id + "-panel"} user={follower} />
        })}
        <ButtonMore isLoading={isLoading} onClick={() => { }} />
      </div>
    </section>
  }
}

export default Followers;