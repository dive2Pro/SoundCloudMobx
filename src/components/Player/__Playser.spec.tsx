import * as React from 'react'
import Player from './index'
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import { playerStore } from '../../store';
import ButtonInline from '../ButtonInline'
import { performanceStore } from '../../store';
import * as stores from '../../store';
import { Provider } from 'mobx-react';

describe('Player Component', () => {
  let track: any = {
    id: 1234,
    title: 'hohohoho',
    user: {

    }
  }
  let props = {
    playerStore,
    performanceStore,
  }
  let wrapper
  beforeEach(() => {
    wrapper =
      mount(
        <Provider {...stores}>
          <Player />
        </Provider>
      )

  })
  it('初始化渲染', () => {
    expect(toJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find(ButtonInline).length).toBe(5)
    expect(wrapper.find({ className: 'fa fa-play' }).length).toBe(1)
    expect(wrapper.find({ className: 'fa fa-pause' }).length).toBe(0)
    expect(wrapper.find({ className: 'fa fa-random' }).length).toBe(1)

  })

  it("action ", () => {
    // playerStore.setPlayingTrack(track)
    let track2 = { ...track, id: 222 }
    playerStore.addToPlaylist([track, track2])
    // playerStore.playNextTrack(1) 
    expect(toJson(wrapper)).toMatchSnapshot()
    expect(playerStore.playList.length).toBe(2)
    expect(playerStore.playingTrack).toEqual(track)
    expect(playerStore.isPlaying).toBeTruthy()
    expect(wrapper.find({ className: 'fa fa-play' }).length).toBe(0)
    expect(wrapper.find({ className: 'fa fa-pause' }).length).toBe(1)
    playerStore.togglePlaying()
    expect(toJson(wrapper)).toMatchSnapshot()
    expect(wrapper.find({ className: 'fa fa-play' }).length).toBe(1)
    expect(toJson(wrapper)).toMatchSnapshot()

  })
})