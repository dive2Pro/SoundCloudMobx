import * as React from 'react'
import ArtWork from '../ArtWork/ArtWork';
import Permalink from '../Permalink/Permalink'
import InfoList from '../InfoList/InfoList'
import { IUser } from '../../interfaces/interface'
import * as CSSModule from 'react-css-modules'
const styles =require('./user.scss')
export interface IUserContainerProps {
  user: IUser
}

@CSSModule(styles)
class UserContainer extends React.Component<IUserContainerProps, any> {

  render() {
    const user = this.props.user
    const { avatar_url, full_name, id,
      followers_count, track_count } = user;
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
      <div styleName='container'>
       <ArtWork size={62} src={avatar_url} clazz="user"/>
        <section styleName='content'>
         <Permalink clazz='user' id={id} fullname={full_name} />
          <InfoList data={infodata} />
        </section>
        <div styleName='actions'>
        </div>
      </div>
    );
  }
}

export default UserContainer;