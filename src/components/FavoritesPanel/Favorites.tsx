import * as React from 'react'
import ViewAll from '../ViewAll';
import MiniTrack from '../MiniTrack'
import { IPlayerStore, ITrack } from "../../store/index";
import { IUserModel } from "../../store";
import ButtonMore from '../ButtonMore'
import { FETCH_FAVORITES } from '../../constants/fetchTypes'
const styles = require('./favorites.scss')

interface IFavoritesProp {
  PlayerStore: IPlayerStore
  UserModel: IUserModel
}

const Favorites = (prop: IFavoritesProp) => {
  const { PlayerStore } = prop
  const { favorites, isLoadings } = prop.UserModel
  const isLoading = isLoadings.get(FETCH_FAVORITES) || false;

  const obj = {
    clazz: 'fa fa-like',
    count: favorites.length,
    typeContent: 'Favorites',
    path: 'favorites'
  }

  return (<section className={styles.base}>
    <div className={styles.top}>
      <ViewAll {...obj} />
    </div>
    <div className={styles.main}>
      {favorites.map((track: ITrack) => {
        return <MiniTrack
          PlayerStore={PlayerStore}
          key={track.id} track={track} />
      })}
      <ButtonMore isLoading={isLoading} onClick={() => { }} />
    </div>
  </section>
  );
}

export default Favorites