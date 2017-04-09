import * as React from 'react'
import ArtWork from '../ArtWork';
import Permalink from '../Permalink/Permalink'
import InfoList from '../InfoList'
import { User } from '../../store'
import ButtonGhost from '../ButtonGhost'
import { observer } from 'mobx-react'
// import { IUserModel } from "../../store/index";
const styles = require('./user.scss')
export interface IUserContainerProps {
  user: User
  onClick: () => void
}

const UserContainer = observer(function UserContainer(props: IUserContainerProps) {
  const { user, onClick } = props
  const { avatar_url, full_name, username, id,
    followers_count, track_count, isFollowing } = user;

  const infodata = [
    {
      count: followers_count,
      clazz: 'fa fa-users'
    }, {
      count: track_count,
      clazz: 'fa fa-music'
    }
  ]
  return (
    <div className={styles.container}>
      <ArtWork size={62} src={avatar_url} clazz="user" />
      <section className={styles.content}>
        <Permalink clazz="user" id={id} fullname={username || full_name} />
        <InfoList data={infodata} />
      </section>
      <div className={styles.actions}>
        <ButtonGhost onClick={onClick} >
          {isFollowing ? 'unfollow' : 'follow'}
        </ButtonGhost>
      </div>
    </div>
  );
}
)

export default UserContainer;