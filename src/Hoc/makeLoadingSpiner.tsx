import * as React from 'react'
import { Component } from 'react'
import LoadingSpinner from '../components/LoadingSpinner'
import { inject, observer } from 'mobx-react';
import { PERFORMANCE_STORE } from '../constants/storeTypes';
import { PerformanceStore } from '../store/PerformanceStore';
import { IisLoading } from "../interfaces/interface";

interface ImakeLoadingSinnerProp {
  rootClazz?: string,
  scrollFunc?: () => void
  performanceStore?: PerformanceStore
  type: string
  onErrorHandler?: () => void
  isLoading?: boolean
  isError?: boolean
}

function makeLoadingSinner<Props, State>
  (
  Comp: new () => Component<Props & IisLoading, State>
  ,
  loadingType?: string) {

  @inject(PERFORMANCE_STORE)
  @observer
  class LoadingSpinnerWrapper
    extends React.PureComponent<Props & ImakeLoadingSinnerProp, State>{

    render() {
      let { rootClazz, type, isError, isLoading
        , performanceStore } = this.props
      if (!performanceStore) {
        return <noscript />
      }
      const ps: any = performanceStore;
      isError = isError || ps.isError(loadingType || type);
      let loading = isLoading || ps.getLoadingState(type);
      return (
        <div className={rootClazz}>
          <Comp
            {...this.props}
            isLoading={isLoading}
          />
          <LoadingSpinner
            isLoading={loading}
            isError={isError}
            onErrorHandler={this.props.scrollFunc
              || this.props.onErrorHandler}
          />
        </div>
      )
    }
  }
  return LoadingSpinnerWrapper
}

export default makeLoadingSinner;