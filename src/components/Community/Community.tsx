import * as React from 'react'
import Hoc from '../HocLoadingMore/HocLoadingEmitLimit'
import LoadingSpinner from '../LoadingSpinner'
import { BigUserIcon } from './index'
import ArtWork from '../ArtWork'
import ButtonGhost from '../ButtonGhost'
const styles = require('./community.scss')
import { withRouter } from 'react-router-dom'
import { observer, inject } from 'mobx-react';
import { UserStore, User } from "../../store/UserStore";
import { USER_STORE } from "../../constants/storeTypes";


interface ICommunityProps {
  userStore?: UserStore
  path: string
  scrollFunc?: () => void
}


export class EmptyView extends React.Component<any, any> {
  render() {
    return <div />
  }
}

@inject(USER_STORE)
@observer
class Community extends React.Component<ICommunityProps, any> {

  handleFollow = (user: User) => {
    // TODO
    // console.log('Todo : toggleFollowing')
    const us = this.props.userStore
    if (us) {
      us.debouncedRequestFollowUser(user)
    }
  }

  render() {
    const { userStore: us, path, scrollFunc } = this.props
    if (!us || !path || !scrollFunc || !us.userModel) {
      return (<noscript />)
    }

    const { isError } = us.userModel
    const users: User[] = us.userModel[path]
    const isLoading = us.userModel.isLoading(path);
    return (
      <div className={styles.main}>
        {
          users.map(user => (
            <BigUserIcon
              key={user.id + '_ bigpic'}
              user={user}
              isFollowing={user.isFollowing}
              handleFollow={() => this.handleFollow(user)}
            />
          ))
        }
        <LoadingSpinner
          isError={isError(path)}
          onErrorHandler={scrollFunc}
          isLoading={isLoading} />
      </div>
    );
  }
}

export default Hoc<ICommunityProps, any>(withRouter(Community))
