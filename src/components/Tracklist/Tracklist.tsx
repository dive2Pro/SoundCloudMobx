import * as React from "react";
import Activities from '../Activities'
// import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
// import { action } from "mobx";


export function getGenreFromPathname(pathname: string) {
  const reg = /=\w{2,8}/g;
  let reged = reg.exec(pathname) || []
  let genre = reged[0].substr(1);
  return genre;
}


@inject('TrackStore')
@observer
class Tracklist extends React.Component<any, any> {
  currentGenre = ''
  componentDidMount() {
    this.setCurrentGenre(this.props);
  }
  setCurrentGenre = (props: any) => {
    let { match: { params: genre } } = props
    console.log('------------------')
    console.log(this.props)
    genre = genre.genre || "Country";

    if (genre != this.currentGenre) {
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
    if (!isLoading) trackStore.fetchTracks();
  };

  render() {

    const {
      TrackStore: { currentTracks, isLoading } } = this.props
    // console.log('TracklistCount ===  ' + TracklistCount++)
    return <Activities
      isLoading={isLoading}
      tracks={currentTracks} sortType={''}
      scrollFunc={this.handleScroll}
    />
  }
}
// let TracklistCount = 0;

export default Tracklist;