import * as React from 'react';
import { observer, inject } from 'mobx-react'
import { IUser } from '../../interfaces/interface'
import UserItemContainer from '../MiniUser'
import { IUserModel, IUserStore } from '../../store'
import {
  // FETCH_FOLLOWINGS,
  FETCH_FOLLOWERS
} from '../../constants/fetchTypes'
import LoadingSpinner from '../LoadingSpinner';
import ViewAll from '../ViewAll';
import { User } from '../../store/UserStore';
const styles = require('./followers.scss')
const debounce = require('lodash/debounce')



export interface IFollowersProps {
  type: string
  history?: any,
  UserStore?: IUserStore
}
@inject('UserStore')
@observer
class Followers extends React.PureComponent<IFollowersProps, {}> {
  debounceFunc: {};

  // TODO refacotror for repeart this with follower  
  getSpecObj = (user: User, type: string) => {
    return {
      count: user && user[`${type}_count`],
      clazz: `fa fa-${type === FETCH_FOLLOWERS ? 'user' : 'users'}`,
      path: type,
      typeContent: type,
      id: user && user.userId
    }
  }

  handleFollowUser = (user: IUser) => {
    const { UserStore } = this.props
    const debounceFunc = debounce(
      () => {
        if (UserStore) {
          UserStore.followUser(user);
        }
      }, 500)
    return () => {
      debounceFunc();
    }
  }

  render() {
    const { UserStore, type } = this.props
    if (!UserStore) {
      return <noscript />
    }

    const um = UserStore.userModel;

    const { user } = um
    const users = um[type];
    const isLoading = um.isLoading(type)
    const limitUsers = users.slice(0, 3)
    const isError = um.isError(type);
    return (
      <section
        className={styles.base}
      >
        <div className={styles.top}>
          <ViewAll
            {...this.getSpecObj(user, type) }
          />
        </div>
        <div
          className={styles.main}>
          {
            limitUsers.map((user: IUser, i: number) => {
              return (
                <UserItemContainer
                  key={i + '-' + user.id + '-panel'}
                  onClick={this.handleFollowUser(user)}
                  user={user}
                />
              )
            })}
          <LoadingSpinner
            isError={isError}
            isLoading={isLoading}
            onErrorHandler={() => um.fetchWithType(type)}
          />
        </div>
      </section>
    )
  }
}

export default Followers;