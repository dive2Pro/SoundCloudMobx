import * as React from "react";
import { inject, observer } from "mobx-react";
import { IPlayerStore, ITrack } from "../../store";
import { seconds2time } from "../../services/utils";
import Table, { ITableBody, ITableBodyItem } from "../Table";
import ButtonInline from "../ButtonInline";
import ArtWork from '../ArtWork'
const styles = require("./playlist.scss");
interface IPlaylistProp {
  PlayerStore?: IPlayerStore
}
@inject("PlayerStore")
@observer
class Playerlist extends React.Component<IPlaylistProp, any> {
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
  handleRemoveFromlist = (track: ITrack) => {
    const PlayerStore = this.props.PlayerStore;
    if (!PlayerStore) return;
    PlayerStore.removeFromPlaylist(track);
  }
  render() {
    const PlayerStore = this.props.PlayerStore;
    if (!PlayerStore) return <noscript />;

    const { playList, playingTrack, isPlaylistOpen } = PlayerStore;
    const mainClass = isPlaylistOpen ? styles.main : styles.none;
    // todo
    const thead = [{ width: 12 }, { width: 50 }, { width: 24 }, { width: 24 }];
    const tbody: ITableBody[] = [];
    playList.map(item => {
      const { id: trackId, title, user, duration, artwork_url } = item;
      const { id, username } = user;
      const configurations = [{
        fn: () => { this.handlePlay(item) },
        className: 'fa fa-play'
      },
      {
        fn: () => { this.handleRemoveFromlist(item) },
        className: "fa fa-trash"
      }
      ];
      const isPlaying = playingTrack ? playingTrack.id == item.id : false;
      const bodyData: ITableBodyItem[] = [
        {
          title: "",
          render: () => (
            <div>
              <ArtWork size={35} src={artwork_url} />
            </div>
          )
        },
        { title },
        { title: username },
        { title: seconds2time(duration), tag: "anchor", }
      ];
      tbody.push({
        trackId,
        singerId: id,
        bodyData,
        configurations,
        live: isPlaying
      });
    });
    return (
      <div className={mainClass}>
        <div className={styles.top}>
          <h3>播放列表{}</h3>
          <div className={styles.top_right}>
            <ButtonInline onClick={this.handleClearlist}>
              <i className="fa fa-trash fa-2x"></i>
            </ButtonInline>
          </div>
          {/* <ButtonInline onClick={this.handleClosePlaylist}>
            <i className="fa fa-close fa-2x" />
          </ButtonInline>*/}
        </div>
        <Table thead={thead} tbody={tbody} />
      </div>
    );
  }
}

export default Playerlist;
