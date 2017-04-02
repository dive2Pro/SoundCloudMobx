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

  // TODO refacotror for repeart this with follower  
  render() {
    const um = this.props.UserModel
    const { followings, user } = um
    const isLoading = um.isLoading(FETCH_FOLLOWINGS)
    const obj = {
      count: user && user.followings_count,
      clazz: "fa fa-users",
      path: 'followings',
      typeContent: 'followings',
      id: user && user.id
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
        <ButtonMore isLoading={isLoading} onClick={() => { }} />
      </div>
    </section>
  }
}

export default Followers;