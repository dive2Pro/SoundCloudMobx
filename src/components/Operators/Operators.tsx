import * as React from 'react'
import ButtonInline from '../ButtonInline'
import { observer, inject } from "._mobx-react@4.1.7@mobx-react";
import { PLAYER_STORE } from "../../constants/storeTypes";
import { PlayerStore } from "../../store/PlayerStore";
import { ITrack } from "../../interfaces/interface";
const styles = require('./operators.scss')

interface IOperatorsProp {
  isPlaylist?: boolean
  playerStore?: PlayerStore
  track?: ITrack
  tracks?: ITrack[]
}

@inject(PLAYER_STORE)
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
    const { isPlaylist } = this.props
    return (
      <div className={styles.infos_actions}>
        <ButtonInline
          onClick={this.handleAddToPlaylist}>
          <i className='fa fa-plus'></i>
        </ButtonInline>
        <ButtonInline>
          <i className="fa fa-heart" />
          <span>likes</span>
        </ButtonInline>
        <ButtonInline>
          <i className="fa fa-share-square-o" />
          <span>
            Share
          </span>
        </ButtonInline>
        {
          !isPlaylist &&
          (<ButtonInline>
            <i className="fa fa-comments" />
            <span>
              Comments
                  </span>
          </ButtonInline>
          )
        }
      </div>
    );
  }

}

export default Operators;