import * as React from 'react'
const styles = require('./browse.scss')
import {
  observer
  , inject
} from 'mobx-react'
import TrackList from '../Tracklist'
import { GENRES } from '../../constants/trackTypes'
import { TrackStore } from '../../store/TrackStore';
import { TRACK_STORE, PERFORMANCE_STORE } from '../../constants/storeTypes';
import { PerformanceStore } from '../../store/PerformanceStore';
import Tabs, { Tab } from '../Tabs';
import makeTranslateXMotion from '../../Hoc/makeTranslateXMotion'

interface IDashBorardProps {
  location?: any,
  genre?: string
  trackStore: TrackStore
  performanceStore: PerformanceStore
  history: any
}

@inject(TRACK_STORE, PERFORMANCE_STORE)
@observer
class Browse extends React.Component<IDashBorardProps, any> {

  public static defaultProps: Partial<IDashBorardProps> = {
    genre: GENRES[0]
  }
  id = 'Browser'

  componentDidMount() {
    this.props.performanceStore.setCurrentGlassNodeId(this.id)
  }
  handleTabActive = (value: string, index: number) => {
    this.props.trackStore.setGenre(value)
    console.log(value);


  }
  render() {
    const { currentGenre } = this.props.trackStore
    const index = GENRES.indexOf(currentGenre)
    const selectedStyle = '#f55874';
    return (
      <div
        id={this.id}
        className={styles.container}
      >
        <Tabs
          onActive={this.handleTabActive}
          initialSelectedIndex={index}
          inkBarStyle={{ background: selectedStyle }}
          selectedTextColor={selectedStyle}
          value={currentGenre}
        >
          {
            GENRES.map((item, i) => {
              return (
                <Tab
                  key={`${item} -- ${i}`}
                  label={item}
                  value={item}
                />)
            })}
        </Tabs>
        <TrackList
          trackStore={this.props.trackStore}
        />
      </div>
    );
  }
}

export default makeTranslateXMotion(Browse)