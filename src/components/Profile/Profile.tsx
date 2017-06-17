import * as React from 'react';
import {observer} from 'mobx-react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import {UserLink as Link} from '../Links';
import {observable, action} from 'mobx';
import {User} from '../../store/UserStore';
const styles = require('./profile.scss');
import {transBigMath} from '../../services/utils';

const MiniCountPanel = observer((props: IProfileProps) => {
  const {id, playlist_count, followers_count, followings_count} = props.user;
  return (
    <ul className={styles.miniPanel}>
      <li>
        <Link path="playlist" id={id}>
          <i>PlayList</i>
          <span>
            {transBigMath(playlist_count)}
          </span>
        </Link>
      </li>
      <li>
        <Link path="followings" id={id}>
          <i>Followings</i>
          <span>
            {transBigMath(followings_count)}
          </span>
        </Link>
      </li>
      <li>
        <Link path="followers" id={id}>
          <i>Followers</i>
          <span>{transBigMath(followers_count)}</span>
        </Link>
      </li>
    </ul>
  );
});

export interface IProfileProps {
  user: User | any;
}

@observer
class Profile extends React.PureComponent<IProfileProps, any> {
  @observable isOpenDesc = false;
  @action
  handleMoreDesc = () => {
    this.isOpenDesc = !this.isOpenDesc;
  };
  render() {
    const user: User = this.props.user;

    if (!user || !user.id) {
      return <LoadingSpinner isLoading={true} />;
    }
    const {description} = user;

    return (
      <div>
        <section className={styles.container}>
          <MiniCountPanel user={user} />
        </section>

        <div
          className={this.isOpenDesc ? styles.showMore_open : styles.showMore}
        >
          <span className={styles.desc}>
            {description}
          </span>

          <div
            style={{display: this.isOpenDesc ? 'none' : 'block'}}
            className={styles.wrapper}
          />
          <div
            className={styles.btn_showmore}
            style={{
              display: description && description.length > 150
                ? 'block'
                : 'none'
            }}
            onClick={this.handleMoreDesc}
          >
            <h5>
              Show More
              <i className={`fa fa-sort-${this.isOpenDesc ? 'up' : 'desc'}`} />
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
