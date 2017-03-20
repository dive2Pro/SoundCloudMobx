import * as React from 'react';
import { inject, observer } from 'mobx-react'
import { IPlayerStore, ITrack } from '../../store'
import { seconds2time } from '../../services/utils'
import Table, { ITableBody, ITableBodyItem } from '../Table'
const styles = require('./playlist.scss')
interface IPlaylistProp {
  PlayerStore?: IPlayerStore
}
@inject('PlayerStore')
@observer
class Playlist extends React.Component<IPlaylistProp, any> {

  handlePlay = (track: ITrack | number) => {
    const PlayerStore = this.props.PlayerStore;
    console.log('-' + track)
    if (!PlayerStore) return;
    PlayerStore.setPlayingTrack(track);
  }

  render() {
    const PlayerStore = this.props.PlayerStore
    if (!PlayerStore) return <noscript />

    const { playList, playingTrack } = PlayerStore;
    // todo
    const thead = [
      { width: 12 }, { width: 50 }, { width: 24 }, { width: 24 }
    ]
    const tbody: ITableBody[] = [];
    playList.map(item => {
      const { id: trackId, title, user, duration } = item;
      const { id, username } = user;
      const configurations = [
        {
          fn: () => {
          }
          , className: `fa fa-plus`
        }
        , {
          fn: () => { }, className: "fa fa-delete"
        }, {
          fn: () => { }
          , className: 'fa fa-folder-o'
        }
      ]
      const isPlaying = playingTrack.id == item.id

      const bodyData: ITableBodyItem[] = [{
        title: "",
        render: () => (
          <div>
            {isPlaying && <i className="fa fa-play-circle on fa-circle fa-2x"></i>}
          </div>
        )
      }, { title, tag: 'anchor', onClick: () => this.handlePlay(item) },
      { title: username },
      { title: seconds2time(duration) }
      ];
      tbody.push({
        trackId, singerId: id, bodyData, configurations
      })
    })
    return (
      <div className={styles.main}>
        <Table

          thead={thead}
          tbody={tbody}
        />
      </div>
    );
  }
}

export default Playlist;