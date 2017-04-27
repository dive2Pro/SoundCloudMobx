import * as React from 'react'
import ButtonInline from '../ButtonInline'
import { observer, inject } from 'mobx-react';
import {PERFORMANCE_STORE, PLAYER_STORE} from '../../constants/storeTypes';
import { PlayerStore } from '../../store/PlayerStore';
import { ITrack } from '../../interfaces/interface';
import {PerformanceStore} from "../../store/PerformanceStore";
const styles = require('./operators.scss');
import makeDumbProps from '../../Hoc/makeDumbProps'
interface IOperatorsProp {
  isPlaylist: boolean
  playerStore: PlayerStore
  performanceStore: PerformanceStore
  track: ITrack
  tracks: ITrack[]
}

@inject(PLAYER_STORE,PERFORMANCE_STORE)
@observer
class Operators extends React.PureComponent<IOperatorsProp, any>  {

  handleAddToPlaylist = () => {
    const { isPlaylist, track, tracks, playerStore } = this.props

    if (playerStore) {
      if (isPlaylist) {
        tracks && playerStore.addToPlaylist(tracks)
      } else {
        track && playerStore.addToPlaylist(track)
      }
    }

  }
  render() {
    const { performanceStore,isPlaylist } = this.props
    const _2xfa = performanceStore.isUnderHandsets?"fa-2x":"";
    return (
      <div className={styles.infos_actions}>
        <ButtonInline
          onClick={this.handleAddToPlaylist}>
          <em className={`fa fa-plus ${_2xfa}`} />
        </ButtonInline>
        <ButtonInline>
          <em className={`fa fa-heart ${_2xfa}`} />
          <span>likes</span>
        </ButtonInline>
        <ButtonInline>
          <em className={`fa fa-share-square-o ${_2xfa}`} />
          <span>Share</span>
        </ButtonInline>
        {
          !isPlaylist &&
          (
            <ButtonInline>
              <em className={`fa fa-comments ${_2xfa}`} />
              <span>Comments</span>
            </ButtonInline>
          )
        }
      </div>
    );
  }

}

export default makeDumbProps(Operators)