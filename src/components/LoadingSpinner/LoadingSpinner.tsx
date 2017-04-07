import * as React from 'react'
const styles = require('./loadingspinner.scss');
// import {observer} from 'mobx-react'
import ButtonInline from '../ButtonInline'
interface ILoadingSpinner {
  isLoading: boolean;
  isError?: boolean
  onErrorHandler?: () => void
}

const LoadingSpinner = (props: ILoadingSpinner) => {
  const { isLoading, isError, onErrorHandler } = props
  if (isLoading) {
    return (
      <div className={styles.spinner_loading}>
        <i className="fa fa-spinner fa-spin fa-2x" />
      </div>
    )
  } else if (isError) {
    return (
      <div className={styles.spinner_error}>
        <i />
        <ButtonInline
          onClick={onErrorHandler ? onErrorHandler : () => {/***/ }}
        >
          click retry...
        </ButtonInline>
      </div>)
  }
  return (<noscript />)
}

export default LoadingSpinner;