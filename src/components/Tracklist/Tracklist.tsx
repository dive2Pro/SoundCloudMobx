import * as React from "react";
import Activities from '../Activities'
import { observable } from 'mobx'
import { observer, inject } from 'mobx-react'
import { action } from "mobx";


export function getGenreFromPathname(pathname: string) {
  const reg = /=\w{2,8}/g;
  let reged = reg.exec(pathname) || []
  let genre = reged[0].substr(1);
  return genre;
}


@inject('TrackStore')
@observer
class Tracklist extends React.Component<any, any> {
  @observable count: any = 0;
  currentGenre = ''
  componentDidMount() {
    let { TrackStore, match: { params: genre } } = this.props
    genre = genre.genre;
    if (!genre) {
      genre = 'country'
    }
    
    this.currentGenre = genre
    TrackStore.setGenre(genre);

  }

  componentWillReceiveProps(nextProp: any) {
    const { TrackStore } = this.props
    let { match: { params: genre } } = nextProp;
    genre = genre.genre;    
    if (!genre) {
      genre = 'country'
    }
    if (genre != this.currentGenre) {
      TrackStore.setGenre(genre);
    }
  }
  componentDidUpdate() {
  }
  componentWillUnMount() {
    console.log('componentWillUnMount')
  }
  handleScroll = () => {
    const trackStore = this.props.TrackStore;
    const { isLoading } = trackStore;
    if (!isLoading) trackStore.fetchTracks();
  };
  @action
  increateCount = () => {
    this.count++
  }
  render() {

    const { TrackStore: { currentTracks, isLoading } } = this.props
    return <div>
      <Activities
        isLoading={isLoading}
        tracks={currentTracks} sortType={''}
        scrollFunc={this.handleScroll}
      />
    </div>
  }
}

export default Tracklist;