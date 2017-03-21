import * as React from "react";
import { inject, observer } from "mobx-react";
import { IPlayerStore, ITrack } from "../../store";
import { seconds2time } from "../../services/utils";
import Table, { ITableBody, ITableBodyItem } from "../Table";
import ButtonInline from "../ButtonInline";
const styles = require("./playlist.scss");
interface IPlaylistProp {
  PlayerStore?: IPlayerStore
}
@inject("PlayerStore")
@observer
class Playlist extends React.Component<IPlaylistProp, any> {
  handlePlay = (track: ITrack | number) => {
    const PlayerStore = this.props.PlayerStore;
    if (!PlayerStore) return;
    PlayerStore.setPlayingTrack(track);
  };
  handleClosePlaylist = () => {
    const PlayerStore = this.props.PlayerStore;
    if (!PlayerStore) return;
    PlayerStore.togglePlaylistOpen(false);
  };
  handleClearlist = () => {
    const PlayerStore = this.props.PlayerStore;
    if (!PlayerStore) return;
    PlayerStore.clearPlaylist();
  };
  render() {
    const PlayerStore = this.props.PlayerStore;
    if (!PlayerStore) return <noscript />;

    const { playList, playingTrack, isPlaylistOpen } = PlayerStore;
    const mainClass = isPlaylistOpen ? styles.main : styles.none;
    // todo
    const thead = [{ width: 12 }, { width: 50 }, { width: 24 }, { width: 24 }];
    const tbody: ITableBody[] = [];
    playList.map(item => {
      const { id: trackId, title, user, duration } = item;
      const { id, username } = user;
      const configurations = [
        {
          fn: () => { },
          className: `fa fa-plus`
        },
        {
          fn: () => { },
          className: "fa fa-delete"
        },
        {
          fn: () => { },
          className: "fa fa-folder-o"
        }
      ];
      const isPlaying = playingTrack.id == item.id;
      const bodyData: ITableBodyItem[] = [
        {
          title: "",
          render: () => (
            <div>
              {isPlaying &&
                <i className="fa fa-play-circle on fa-circle fa-2x" />}
            </div>
          )
        },
        { title, tag: "anchor", onClick: () => this.handlePlay(item) },
        { title: username },
        { title: seconds2time(duration) }
      ];
      tbody.push({
        trackId,
        singerId: id,
        bodyData,
        configurations
      });
    });
    return (
      <div className={mainClass}>
        <div className={styles.top}>
          <h3>播放列表{}</h3>
          <div className={styles.top_right}>
            <ButtonInline onClick={this.handleClearlist}>
              <i className="fa fa-delete">清除</i>
            </ButtonInline>
          </div>
          <ButtonInline onClick={this.handleClosePlaylist}>
            <i className="fa fa-close" />
          </ButtonInline>
        </div>
        <Table thead={thead} tbody={tbody} />
      </div>
    );
  }
}

export default Playlist;
