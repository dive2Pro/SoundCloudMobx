import * as React from 'react';
// import { IUser } from "../../interfaces/interface";
import {
  observer
  // , inject
} from 'mobx-react';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
// import ArtWork from "../ArtWork/ArtWork";
import Link from '../RouterLink'
import {
  observable, action
  // , observe
} from 'mobx';
// import { IUserModel } from "../../store/index";
import {
  // whyRun
  // isObservableObject,
  observe
} from 'mobx'
import { IUserModel } from '../../store/index';
import { IUser } from "../../interfaces/interface";
import { User } from "../../store/UserStore";
// import { IUser } from '../../interfaces/interface'
// import { User } from "../../store/UserStore";
const styles = require('./profile.scss');
export interface IProfileProps {
  // tslint:disable-next-line:no-any
  user: IUser | any
}


const MiniCountPanel = observer((props: IProfileProps) => {
  const { id, playlist_count, followers_count, followings_count } = props.user;
  console.log(props.user, 'MiniCountPaner', followers_count)
  return (
    <ul className={styles.miniPanel}>
      <li>
        <Link
          path="playlist"
          id={id}
        ><i>PlayList</i>
          <em>
            {playlist_count}
          </em>
        </Link>
      </li>
      <li>
        <Link
          path="followings"
          id={id}
        ><i>Followings</i>
          <em>
            {followings_count + ''}
          </em>
        </Link>
      </li>
      <li>
        <Link
          path="followers"
          id={id}
        >
          <i>Followers</i>
          <em>{followers_count + ''}</em>
        </Link>
      </li>
    </ul>
  );
})





@observer
class Profile extends React.PureComponent<IProfileProps, any>  {
  @observable isOpenDesc = false
  @action handleMoreDesc = () => {
    this.isOpenDesc = !this.isOpenDesc
  }
  render() {

    const user: User = this.props.user
    /**
     * 要注意:
     *       mobx现在不支持对实例动态的添加的观察对象
     *      ,这里在User中用observableMap重写了get方法
     *      ,需要在这里调用 加入绑定
     */
    if (!user || !user.objMap.size) {
      return <LoadingSpinner isLoading={true} />;
    }
    // console.log(props.user)
    const { description } = user;

    return (
      <div>
        <section className={styles.container}>
          <MiniCountPanel
            user={user}
          />
        </section>

        {/*{userModel.isLoading}*/}
        <div
          className={this.isOpenDesc ? styles.showMore_open : styles.showMore}
        >
          <span className={styles.desc}>
            {description}
          </span>

          <div
            style={{ display: this.isOpenDesc ? 'none' : 'block' }}
            className={styles.wrapper}
          />
          <div
            className={styles.btn_showmore}
            style={{
              display: description && description.length > 150
                ? 'block' : 'none'
            }}
            onClick={this.handleMoreDesc}
          >
            {/*{description.length}*/}
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