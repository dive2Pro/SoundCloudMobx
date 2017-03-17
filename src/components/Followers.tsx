import * as React from 'react';
import { observer } from 'mobx-react'
import { IUser } from '../interfaces/interface'
import LoadingSpinner from './LoadingSpinner/LoadingSpinner'
import ArtWork from './ArtWork/ArtWork';

export interface IFollowersProps {
  followers: IUser[];
  isLoading: boolean;
}

interface IPermalinkProp {
  id: number
  fullname: string
}
const Permalink = ({ id, fullname }: IPermalinkProp) => {
  return <div styleName="permalink">
    <a href="#" >{fullname}</a>
  </div>
}

interface IInfoActionModel {
  clazz: string;
  count: number;
  onClickHandle?: () => void;
}
interface IInfoListProp {
  data: IInfoActionModel[];
}

const InfoList = ({ data }: IInfoListProp) => {
  /*
    const handleClick = (listener:()=>void) => {
      return () => {
        listener();
      }
    }*/
  data.map(item => {
    const { clazz: clz, count, onClickHandle } = item
    const clazz = 'fa ' + clz;
    return <div onClick={(onClickHandle)}>
      <i className={clazz}>{count}</i>
    </div>
  })

  return (<div styleName='container'>

  </div>)

}

const TrackItem = (user: IUser) => {
  const { avatar_url, full_name, id,
    followers_count, track_count } = user;
  const infodata: IInfoActionModel[] = [
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
      <ArtWork size={62} src={avatar_url} />
      <section styleName='content'>
        <Permalink id={id} fullname={full_name} />
        <InfoList data={infodata} />
      </section>
      <div styleName='actions'>
      </div>
    </div>
  )
}


@observer
class Followers extends React.Component<IFollowersProps, any> {

  render() {
    const { followers, isLoading } = this.props
    return followers ?
      <div>
        {followers.map((follower: IUser) => {
          return <TrackItem key={follower.id} {...follower} />
        })}
      </div>
      : <LoadingSpinner isLoading={isLoading} />
  }
}

export default Followers;