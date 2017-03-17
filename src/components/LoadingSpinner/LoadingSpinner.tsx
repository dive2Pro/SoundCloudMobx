import * as React from 'react'

interface ILoadingSpinner {
  isLoading: boolean;
}

const LoadingSpinner = ({ isLoading }: ILoadingSpinner) => {

  return isLoading ? (
    <div className='spinner-loading'>
      <i className='fa fa-spinner fa-spin'></i>
    </div>) : <div>

    </div>
}

export default LoadingSpinner;