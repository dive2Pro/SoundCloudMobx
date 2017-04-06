import * as React from 'react'
import {
  // inject,
  observer
} from "._mobx-react@4.1.5@mobx-react";
import {
  // ITrackStore
  // IUserStore,
  IUserModel
} from "../../store/index";
import Activities from '../Activities'
// const styles = require('./.scss')
import { FETCH_STREAM } from '../../constants/fetchTypes'

interface IStreamProps {
  userModel: IUserModel
}

// @inject( 'UserStore')
@observer
class Stream extends React.Component<IStreamProps, any> {
  render() {
    const { userModel } = this.props
    // const { streams } = userModel.streams
    const isloadingFavorites = userModel.isLoading(FETCH_STREAM);
    return (
      <Activities
        sortType={''}
        isLoading={isloadingFavorites}
        scrollFunc={() => userModel.fetchWithType(FETCH_STREAM)}
        tracks={userModel.getAllTrackFromStreams()}
      />)

  }
}

export default Stream;