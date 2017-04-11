import * as React from 'react'
import ViewAll from '../ViewAll';
import MiniTrack from '../MiniTrack'
import LoadingSpinner from '../LoadingSpinner'
import { observer } from 'mobx-react'
import { FETCH_FAVORITES } from '../../constants/fetchTypes'
import { UserModel } from '../../store/UserStore';
import { ITrack } from '../../interfaces/interface';
import { PlayerStore } from '../../store/PlayerStore';

const styles = require('./favorites.scss')

interface IFavoritesProp {
  playerStore: PlayerStore
  UserModel: UserModel
}

const Favorites = observer((prop: IFavoritesProp) => {
  const { playerStore, UserModel } = prop
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
              playerStore={playerStore}
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