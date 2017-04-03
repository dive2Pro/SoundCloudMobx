import * as React from "react";
import { IUser } from "../../interfaces/interface";
import {
  observer
  // , inject
} from "mobx-react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ArtWork from "../ArtWork/ArtWork";
import Link from '../RouterLink'
import { observable, action } from "mobx";
const styles = require("./profile.scss");
export interface IProfileProps {
  user: IUser
}

interface IMiniCountPanelProp {
  playlist_count: number,
  followers_count: number,
  followings_count: number,
  user: IUser
}
@observer
class MiniCountPanel extends React.Component<IMiniCountPanelProp, any> {
  render() {
    const { user: { id }, playlist_count, followers_count, followings_count } = this.props;

    return (
      <ul className={styles.miniPanel}>
        <li>
          <Link
            path="playlist" id={id}
          ><i>PlayList</i>
            <em>
              {playlist_count}
            </em>
          </Link>
        </li>
        <li>
          <Link
            path="followings" id={id}
          ><i>Followings</i>
            <em>
              {followings_count}
            </em>
          </Link>
        </li>
        <li>
          <Link
            path="followers" id={id} ><i>Followers</i>
            <em>{followers_count}</em>
          </Link>
        </li>
      </ul>
    );
  }
}

@observer
class Profile extends React.Component<IProfileProps, any> {
  @observable isOpenDesc = false
  @action handleMoreDesc = () => {
    this.isOpenDesc = !this.isOpenDesc
  }
  render() {
    const user = this.props.user;
    if (!user) return <LoadingSpinner isLoading={true} />;
    const {
      avatar_url,
      description,
      full_name,
      playlist_count,
      followers_count,
      followings_count
    } = user;
    const miniProp = { playlist_count, followers_count, followings_count, user };
    const artInfo = { size: 62, alt: "Me", src: avatar_url };
    return (
      <div>
        <section className={styles.container}>
          <figure>
            <ArtWork {...artInfo} />
            <div className={styles.info}>
              <h5 className={styles.fullname}>
                {full_name}
              </h5>
            </div>
          </figure>
          <MiniCountPanel {...miniProp} />
        </section>

        <div
          className={this.isOpenDesc ? styles.showMore_open : styles.showMore}>
          <span className={styles.desc}>
            {description}
          </span>
          <div
            style={{ display: this.isOpenDesc ? 'none' : 'block' }}
            className={styles.wrapper}></div>
          <div
            className={styles.btn_showmore}
            style={{
              display: description && description.length > 150
                ? 'block' : 'none'
            }}
            onClick={this.handleMoreDesc}>
            {/*{description.length}*/}
            <h5>Show More <i className={`fa fa-sort-${this.isOpenDesc ? 'up' : 'desc'}`}></i></h5>
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
