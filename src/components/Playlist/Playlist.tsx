import * as React from 'react';
import { inject, observer } from 'mobx-react'
import { IPlayerStore } from '../../store'

import { seconds2time } from '../../services/utils'
import Table, { ITableBody, ITableBodyItem } from '../Table'
const styles = require('./playlist.scss')
interface IPlaylistProp {
  PlayerStore?: IPlayerStore
}
@inject('PlayerStore')
@observer
class Playlist extends React.Component<IPlaylistProp, any> {

  render() {

    if (!this.props.PlayerStore) return <noscript />
    const { playList } = this.props.PlayerStore
    // todo
    const thead = [
      { width: 3 }, { width: 35 }, { width: 6 }, { width: 3 }
    ]
    const tbody: ITableBody[] = [];
    playList.map(item => {
      const { id: trackId, title, user, duration } = item;
      const { id, username } = user;
      const bodyData: ITableBodyItem[] = [{
        title: "",
        render: () => (
          <div>
            <i className="fa fa-play-circle">
            </i>
          </div>
        )
      }, { title },
      { title: username, tag: 'anchor' },
      { title: seconds2time(duration) }
      ];
      tbody.push({
        trackId, singerId: id, bodyData
      })
    })
    return (
      <div className={styles.main}>
        <Table thead={thead} tbody={tbody} />
      </div>
    );
  }
}

export default Playlist;