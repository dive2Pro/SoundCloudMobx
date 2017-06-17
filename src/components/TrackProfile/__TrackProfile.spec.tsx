import * as React from 'react';
import TrackProfile from './index';
import {shallow, mount} from 'enzyme';
import toJson from 'enzyme-to-json';
import {HomeLink} from '../Links';
import {playerStore, performanceStore} from '../../store';
import ButtonInline from '../ButtonInline';
import {StaticRouter} from 'react-router-dom';
describe('TrackProfile Component', () => {
  let track: any = {
    id: 1234,
    title: 'hohohoho'
  };
  let props = {
    type: 'HEI',
    bigPic: 'www.image.com',
    label_name: 'label',
    user: {id: 123, username: 'hoho'},
    playerStore,
    performanceStore,
    track
  };
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <StaticRouter context={{}}><TrackProfile {...props} /></StaticRouter>
    );
  });
  it('初始化渲染', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(HomeLink).length).toBe(1);
    expect(wrapper.find(ButtonInline).length).toBe(1);
    expect(wrapper.find(HomeLink).text()).toBe(props.user.username);
  });

  it('TrackProfile button 点击播放 操作', () => {
    expect(playerStore.playingTrack).toBeUndefined();

    wrapper.find(ButtonInline).simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();

    expect(playerStore.playingTrack).toEqual(track);
    expect(playerStore.isPlaying).toBeTruthy();
    expect(playerStore.playList.length).toBe(1);
    expect(wrapper.find({className: 'fa fa-pause fa-2x'}).length).toBe(1);
    expect(playerStore.playList.slice()).toEqual([track]);

    wrapper.find(ButtonInline).simulate('click');
    expect(toJson(wrapper)).toMatchSnapshot();

    expect(playerStore.isPlaying).toBeFalsy();
    expect(wrapper.find({className: 'fa fa-pause fa-2x'}).length).toBe(0);
    expect(wrapper.find({className: 'fa fa-play fa-3x'}).length).toBe(1);
  });
});
