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
      const { rootClazz, type
        , performanceStore } = this.props
      if (!performanceStore) {
        return <noscript />
      }
      const ps: any = performanceStore;
      const isError = ps.isError(loadingType || type);
      const isLoading = ps.getLoadingState(type);
      return (
        <div className={rootClazz}>
          <Comp
            {...this.props}
            isLoading={isLoading}
          />
          <LoadingSpinner
            isLoading={isLoading}
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