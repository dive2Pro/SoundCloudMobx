import * as React from 'react'
import { IUser } from '../..//interfaces/interface'
import { observer } from 'mobx-react'

import * as  CSSModules from 'react-css-modules'
const styles = require('./profile.scss');
export interface IProfileProps {
  user: IUser
}
export interface IArtpicProps {
  size: number
  alt?: string
  src: string
  optionalImg?: string
}
const Artpic = (prop: IArtpicProps) => {
  const { size, src, optionalImg, alt } = prop
  return (
    <img src={src || optionalImg} width={size} height={size} alt={alt} />
  )
}

interface IMiniCountPanelProp {
  playlist_count: number
  followers_count: number
  followings_count: number
}
@CSSModules(styles)
class MiniCountPanel extends React.Component<IMiniCountPanelProp, any> {
  render() {
    const { playlist_count, followers_count, followings_count } = this.props
    return (<ul styleName='miniPanel'>
      <li>
        <a href="#">
          <i>PlayList</i>
          <em>
            {playlist_count}</em>
        </a>
      </li>
      <li>
        <a href="#">
          <i>Followings</i>
          <em>
            {followings_count}</em>
        </a>
      </li>
      <li>
        <a href="#">
          <i>Followers</i>
          <em>{followers_count}</em>
        </a>
      </li>
    </ul>)
  }
}


@observer
@CSSModules(styles)
class Profile extends React.Component<IProfileProps, any> {

  render() {
    const user = this.props.user;
    if (!user) return <div>....</div>
    const {
      avatar_url,
      description,
      full_name,
      playlist_count,
      followers_count,
      followings_count,
    } = user;
    const miniProp = { playlist_count, followers_count, followings_count }
    const artInfo: IArtpicProps = { size: 62, alt: "Me", src: avatar_url }
    return (
      <section styleName="container">
        <figure>
          <Artpic   {...artInfo} />
          <div styleName='info'>
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