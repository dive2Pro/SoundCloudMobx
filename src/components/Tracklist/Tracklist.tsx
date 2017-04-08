import * as React from "react";
import Activities from '../Activities'

import ButtonMore from '../ButtonMore'
import { observer, inject } from 'mobx-react'
import { ITrackStore } from "../../store/index";

export function getGenreFromPathname(pathname: string) {
  const reg = /=\w{2,8}/g;
  let reged = reg.exec(pathname) || []
  let genre = reged[0].substr(1);
  return genre;
}

@inject('TrackStore')
@observer
class Tracklist extends React.Component<{ TrackStore: ITrackStore }, any> {
  currentGenre = ''
  componentDidMount() {
    this.setCurrentGenre(this.props);
  }
  setCurrentGenre = (props: any) => {
    let { match: { params: genre } } = props
    genre = genre.genre || 'Country';

    if (genre !== this.currentGenre) {
      let { TrackStore } = this.props
      TrackStore.setGenre(genre);
    }
    this.currentGenre = genre;
  }
  componentWillReceiveProps(nextProp: any) {
    this.setCurrentGenre(nextProp);
  }

  handleScroll = () => {
    const trackStore = this.props.TrackStore;
    const { isLoading } = trackStore;
    if (!isLoading) { trackStore.fetchTracks(); }
  };

  render() {
    const { TrackStore } = this.props;
    const { currentTracks, isLoading, isError } = TrackStore
    const ie = isError(this.currentGenre);
    return (
      <div
        style={{
          padding: '10px 20px'
        }}
      >
        <Activities
          isLoading={isLoading}
          tracks={currentTracks}
          sortType={''}
          isError={ie}
          scrollFunc={this.handleScroll}
        />

        <ButtonMore
          onClick={() => TrackStore.fetchTracks()}
          isHidden={ie || isLoading || currentTracks.length > 20}
          isLoading={isLoading}
        />

      </div>
    )
  }
}
// let TracklistCount = 0;

export default Tracklist;