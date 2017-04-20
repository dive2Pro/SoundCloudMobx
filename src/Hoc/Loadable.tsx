import * as React from 'react'
// import { Component, ReactElement } from 'react'


interface ILoadableProps {
  // loader: any | () => Promise<new () => Component<any, any>>,
  loader: any
  // LoadingComponent: (new () => Component<any, any>),
  LoadingComponent: any,

}

const babelInterop = obj => obj && obj.__esModule ? obj.default : obj
function Loadable({ loader, LoadingComponent }: ILoadableProps) {

  let isLoading = false
  let outsideComponent
  let outsideError
  let outsidePromise
  const load = () => {

    require.ensure([], req => {
      const das = req('../components/DashBoard')
      console.log(das)
      debugger
    })

    if (!outsidePromise) {
      isLoading = true

      outsidePromise = loader()
        .then(comp => {
          // console.log('----------', comp);

          isLoading = false
          outsideComponent = babelInterop(comp)
        }).catch(err => {
          isLoading = false;
          console.log('err = ', err);
          outsideError = err
        })
    }
    return outsidePromise
  }

  return class LoadableWrapper extends React.Component<ILoadableProps, {
    Comp: (new () => React.Component<any, any>), error: any
  }> {
    _mouted = false;
    state: any = {};
    constructor() {
      super()
      this.state = {}
      this.setState({
        error: outsideError,
        Comp: outsideComponent
      })
    }

    componentWillMount() {
      this._mouted = true
      if (this.state.Comp) {
        return
      }
      load().then(
        () => {
          if (!this._mouted) { return }
          this.setState({
            error: outsideError,
            Comp: outsideComponent
          })
        }
      )
    }
    componentWillUnmount() {
      this._mouted = false
    }
    render() {
      const { error, Comp } = this.state
      if (isLoading) {
        return (
          <LoadingComponent
            isLoading={isLoading}
          />)
      } else if (Comp) {
        return <Comp {...this.props} />
      } else {
        return (<div >{...error}</div>)
      }
    }
  }
}

export default Loadable;
