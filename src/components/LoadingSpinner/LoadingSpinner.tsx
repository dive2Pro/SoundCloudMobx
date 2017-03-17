import * as React from 'react'
require('./loadingspinner.scss');
interface ILoadingSpinner {
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }: ILoadingSpinner) => {

  return isLoading ? (
    <div className='spinner_loading'>
      <i className='fa fa-spinner fa-spin'></i>
    </div>) : <div>

    </div>
}

export default LoadingSpinner;