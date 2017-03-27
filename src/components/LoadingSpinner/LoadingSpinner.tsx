import * as React from 'react'
const styles = require('./loadingspinner.scss');
// import {observer} from 'mobx-react'

interface ILoadingSpinner {
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }: ILoadingSpinner) => {

  return isLoading ? (
    <div className={styles.spinner_loading}>
      <i className='fa fa-spinner fa-spin fa-2x'></i>
    </div>) : <noscript />
}

export default LoadingSpinner;