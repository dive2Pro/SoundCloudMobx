import * as React from 'react';
import {observer, inject} from 'mobx-react';

import UserItemContainer from '../MiniUser';
import {FETCH_FOLLOWERS} from '../../constants/fetchTypes';
import ViewAll from '../ViewAll';
import {UserStore, User} from '../../store/UserStore';
import {USER_STORE} from '../../constants/storeTypes';
import makeLoadingSpinner from '../../Hoc/makeLoadingSpiner';
import {IisLoading} from '../../interfaces/interface';
import makeDumbProps from '../../Hoc/makeDumbProps';
const styles = require('./followers.scss');

export interface IFollowersProps extends IisLoading {
  type: string;
  userStore: UserStore;
}
@inject(USER_STORE)
@observer
export class Followers extends React.PureComponent<IFollowersProps, {}> {
  debounceFunc: {};

  // TODO refacotror for repeart this with follower
  getSpecObj = (user: User, type: string) => {
    return {
      count: user && user[`${type}_count`],
      clazz: `fa fa-${type === FETCH_FOLLOWERS ? 'user' : 'users'}`,
      path: type,
      typeContent: type,
      id: user && user.userId
    };
  };

  handleFollowUser = (user: User) => {
    const {userStore} = this.props;

    if (userStore) {
      return () => userStore.debouncedRequestFollowUser(user);
    } else {
      return () => {
        /***/
      };
    }
  };

  render() {
    const {userStore, type, isLoading} = this.props;
    if (!userStore || !userStore.userModel || isLoading) {
      return <noscript />;
    }

    const um = userStore.userModel;
    const {user} = um;
    const users = um[type];
    const limitUsers = users.slice(0, 3);
    return (
      <section className={styles.base}>
        <div className={styles.top}>
          <ViewAll {...this.getSpecObj(user, type)} />
        </div>

        <div className={styles.main}>
          {limitUsers.map((u: User, i: number) => {
            return (
              <UserItemContainer
                key={i + '-' + u.id + '-panel'}
                onClick={this.handleFollowUser(u)}
                user={u}
              />
            );
          })}
        </div>
      </section>
    );
  }
}

export default makeLoadingSpinner(makeDumbProps(Followers), styles.base);
