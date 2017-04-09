import * as React from 'react'
import ViewAll from '../ViewAll';
import MiniTrack from '../MiniTrack'
import { IPlayerStore, ITrack } from '../../store/index';

import LoadingSpinner from '../LoadingSpinner'
import { observer } from 'mobx-react'
import { FETCH_FAVORITES } from '../../constants/fetchTypes'
import { IUserModel } from "../../store/UserStore";

const styles = require('./favorites.scss')

interface IFavoritesProp {
  PlayerStore: IPlayerStore
  UserModel: IUserModel
}

const Favorites = observer((prop: IFavoritesProp) => {
  const { PlayerStore, UserModel } = prop
  const { favorites } = UserModel
  const isLoading = UserModel.isLoading(FETCH_FAVORITES)
  const isError = UserModel.isError(FETCH_FAVORITES);
  const obj = {
    clazz: 'fa fa-like',
    count: favorites.length,
    typeContent: 'Favorites',
    path: 'favorites',
    id: UserModel.user && UserModel.user.userId
  }

  return (
    <section className={styles.base}>
      <div className={styles.top}>
        <ViewAll {...obj} />
      </div>
      <div className={styles.main}>
        {favorites.slice(0, 3).map((track: ITrack) => {
          return (
            <MiniTrack
              PlayerStore={PlayerStore}
              key={track.id + ' - ' + obj.path}
              track={track}
            />)
        })}
        <LoadingSpinner
          isError={isError}
          onErrorHandler={() => UserModel.fetchWithType(FETCH_FAVORITES)}
          isLoading={isLoading}
        />
      </div>
    </section>
  );
})

export default Favorites