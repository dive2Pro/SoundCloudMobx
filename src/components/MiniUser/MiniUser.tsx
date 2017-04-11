import * as React from 'react'
import ArtWork from '../ArtWork';
import { HomeLink } from '../Links'
import InfoList from '../InfoList'
import { transBigMath } from '../../services/utils'
import ButtonGhost from '../ButtonGhost'
import { observer } from 'mobx-react'
import { User } from "../../store/UserStore";
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
      count: transBigMath(followers_count),
      clazz: 'fa fa-users'
    }, {
      count: transBigMath(track_count),
      clazz: 'fa fa-music'
    }
  ]
  return (
    <div className={styles.container}>
      <ArtWork size={62} src={avatar_url} clazz="user" />
      <section className={styles.content}>
        <HomeLink clazz="user" id={id}
        >
          {username || full_name}
        </HomeLink>
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