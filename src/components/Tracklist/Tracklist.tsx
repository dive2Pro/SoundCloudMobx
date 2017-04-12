import * as React from 'react';
import Activities from '../Activities'
import ButtonMore from '../ButtonMore'
import { observer } from 'mobx-react'
import { TrackStore } from '../../store/TrackStore';

export function getGenreFromPathname(pathname: string) {
  const reg = /=\w{2,8}/g;
  let reged = reg.exec(pathname) || []
  let genre = reged[0].substr(1);
  return genre;
}

@observer
class Tracklist extends React.Component<{ trackStore: TrackStore }, any> {


  handleScroll = () => {
    const trackStore = this.props.trackStore;
    const { isLoading } = trackStore;
    if (!isLoading) { trackStore.fetchTracks(); }
  };

  render() {
    const { trackStore } = this.props;
    const { currentTracks, isLoading, isError, currentGenre } = trackStore
    const ie = isError(currentGenre);
    return (
      <div
        style={{
          padding: '10px'
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
          onClick={() => trackStore.fetchTracks()}
          isHidden={ie || isLoading || currentTracks.length > 20}
          isLoading={isLoading}
        />

      </div>
    )
  }
}
export default Tracklist;