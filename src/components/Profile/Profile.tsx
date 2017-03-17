import * as React from 'react'
import { IUser } from '../..//interfaces/interface'
// import { observer } from 'mobx-react'

import CSSModules from 'react-css-modules'
import styles from './profile.scss';
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

const MiniCountPanel = (data: IMiniCountPanelProp) => {

  return (<nav>
    <div>
      <span>PlayList</span>
      {data.playlist_count}
    </div>

    <div>
      <span>Followings</span>
      {data.followings_count}
    </div>
    <div>
      <span>Followers</span>
      {data.followers_count}
    </div>
  </nav>)
}

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
    const artInfo: IArtpicProps = { size: 40, alt: "Me", src: avatar_url }
    return (
      <section>
        <figure>
          <Artpic {...artInfo} />
          {full_name}
          |{description}
        </figure>
        <MiniCountPanel {...miniProp} />
      </section>
    );
  }
}

export default Profile;