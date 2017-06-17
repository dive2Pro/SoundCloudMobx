import * as React from 'react';
const styles = require('./browse.scss');
import {observer, inject} from 'mobx-react';
import TrackList from '../Tracklist';
import {GENRES} from '../../constants/trackTypes';
import {TrackStore} from '../../store/TrackStore';
import {TRACK_STORE, PERFORMANCE_STORE} from '../../constants/storeTypes';
import {PerformanceStore} from '../../store/PerformanceStore';
import Tabs, {Tab} from '../Tabs';
import makeTranslateXMotion from '../../Hoc/makeTranslateXMotion';
import makeBackToTop from '../../Hoc/makeBackToTop';
import {computed, expr} from 'mobx';
const Slider = require('dive-slider');
require('dive-slider/lib/slider.css');
interface IDashBorardProps {
  location?: any;
  genre?: string;
  trackStore: TrackStore;
  performanceStore: PerformanceStore;
  history: any;
  searchGenre?: string;
}

@inject(TRACK_STORE, PERFORMANCE_STORE)
@observer
class Browse extends React.Component<IDashBorardProps, any> {
  public static defaultProps: Partial<IDashBorardProps> = {
    genre: GENRES[0]
  };

  id = 'Browser';

  componentDidMount() {
    const {currentGenre} = this.props.trackStore;

    if (!GENRES.some(item => item === currentGenre)) {
      this.props.trackStore.setGenre(GENRES[0]);
    }

    this.props.performanceStore.setCurrentGlassNodeId(this.id);
  }

  handleTabActive = (value: string, index: number) => {
    this.props.trackStore.setGenre(value);
  };

  @computed
  get tabFixedStyle() {
    const {performanceStore} = this.props;
    const style = {};

    let isScrolled = expr(() => {
      return performanceStore.scrollY > 100;
    });

    return {...style, isScrolled};
  }

  handleSliderImageClicked = (src, index) => {
    const {trackStore, history} = this.props;
    const id = trackStore.sliderImages[index].id;
    history.push(`/stream?id=${id}`);
  };
  render() {
    const {currentGenre} = this.props.trackStore;
    const {performanceStore} = this.props;
    const index = GENRES.indexOf(currentGenre);
    const selectedStyle = '#f55874';
    let tempStyle = {};

    if (performanceStore.windowWidth < 900) {
      tempStyle = {...tempStyle, minWidth: 115};
    }
    const sliderTracks = this.props.trackStore.sliderImages.map(
      item => item.src
    );
    return (
      <div id={this.id} className={styles.container}>
        <header>
          {!performanceStore.isUnderLarge &&
            <Slider
              height={400}
              width={500}
              srcs={sliderTracks}
              handleImageClick={this.handleSliderImageClicked}
            />}
        </header>
        <main>
          <Tabs
            onActive={this.handleTabActive}
            initialSelectedIndex={index}
            inkBarStyle={{...tempStyle, background: selectedStyle}}
            selectedTextColor={selectedStyle}
            value={currentGenre}
            tabTemplateStyle={tempStyle}
            containerStyle={this.tabFixedStyle}
          >
            {GENRES.map((item, i) => {
              return <Tab key={`${item} -- ${i}`} label={item} value={item} />;
            })}
          </Tabs>
          <TrackList trackStore={this.props.trackStore} />
        </main>
      </div>
    );
  }
}

export default makeBackToTop(makeTranslateXMotion(Browse));
