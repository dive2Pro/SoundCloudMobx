import * as React from "react";
import { IUser } from "../..//interfaces/interface";
import {
  observer
  // , inject
} from "mobx-react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import * as CSSModules from "react-css-modules";
import ArtWork from "../ArtWork/ArtWork";
import Link from '../RouterLink'
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
@CSSModules(styles)
class MiniCountPanel extends React.Component<IMiniCountPanelProp, any> {
  render() {
    const { user: { id }, playlist_count, followers_count, followings_count } = this.props;

    return (
      <ul styleName="miniPanel">
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
            path="followers" id={id}
          ><i>Followers</i>
            <em>{followers_count}</em>
          </Link>
        </li>
      </ul>
    );
  }
}

@observer
@CSSModules(styles)
class Profile extends React.Component<IProfileProps, any> {
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
      <section styleName="container">
        <figure>
          <ArtWork {...artInfo} />
          <div styleName="info">
            <h5 styleName="fullname">
              {full_name}
            </h5>
            <span styleName="desc">
              {description}
            </span>
          </div>
        </figure>
        <MiniCountPanel {...miniProp} />
      </section>
    );
  }
}

export default Profile;
