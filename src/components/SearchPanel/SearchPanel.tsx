import * as React from 'react'
const styles = require('./searchpanel.scss')
import {
  observer
} from 'mobx-react';
const _ = require('lodash')

import { Component } from "react";
import * as ReactDOM from 'react-dom'


interface ISearchPanelProps {
  handleSearch: (value: string) => void;
  isOpen: boolean,
  onSubmit: () => void,
  additionalStyles: any,
  onClick: () => void
  autoSearch: boolean
}

const defaultStyle = {
  open: {
    width: 180
  },
  close: {
    width: 0
  },
  frame: {
    border: `1px solid #f55874`,
    borderRadius: '5px'
  },
  smallIcon: {
    width: 30,
    height: 30
  },
  icon: {
    width: 40,
    height: 40,
    padding: 5,
    top: 10
  }
}


function catchOutSideCLick<Props, State>(Comp: new () => Component<Props
  , State>
) {
  return class CatchOutSideWrapper extends React.PureComponent<Props & { onClick: () => void, isOpen: boolean }, any>{

    componentDidMount() {
      document.addEventListener('mousedown', this.onOutsideClick);
    }

    componentWillUnmount() {
      document.addEventListener('mousedown', this.onOutsideClick);
    }

    onOutsideClick = (event) => {
      if (!this.props.isOpen) { return }
      event.preventDefault();
      const local = ReactDOM.findDOMNode(this)


      let target = event.target
      while (target.parentNode) {
        if (target === local) {
          return
        }
        target = target.parentNode
      }
      this.props.onClick();

    }
    render() {
      return (
        <Comp
          {...this.props}
        />
      )
    }
  }
}


const animationStyle = {
  transition: 'width 0.2s ease'
}

function makeExpandingAnimation<Props, State>(
  Comp: new () => Component<Props
    & {
      onClick: () => void, isOpen: boolean,
      additionalStyles: any,
    }, State>
) {
  return class ExpandingAnimationWrapper extends React.PureComponent<Props, any>{

    state = { isOpen: false }

    handleExpandClick = () => {
      this.setState((prevState) => ({ isOpen: !prevState.isOpen }))
    }

    render() {

      return (
        <Comp
          onClick={this.handleExpandClick}
          isOpen={this.state.isOpen}
          additionalStyles={{ text: animationStyle }}
          {...this.props}
        />
      )
    }
  }
}

@observer
class SearchPanel extends React.Component<ISearchPanelProps, any> {
  query: HTMLInputElement;
  handleChange = (value: string) => {
    _.debounce(() => this.props.handleSearch(value), 500)();
  }
  handleKeyUp = (event) => {
    const ENTER_KEY = 13;
    if (event.keyCode === ENTER_KEY) {
      event.preventDefault();
      this.props.handleSearch(event.target.value);
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.isOpen) {
      this.query.focus();
    }
  }

  render() {
    const debounceChange = _.debounce(this.handleChange, 599);
    const { additionalStyles, isOpen, onClick, autoSearch } = this.props
    let textStyle = isOpen ? defaultStyle.open : defaultStyle.close
    textStyle = { ...textStyle, ...additionalStyles ? additionalStyles.text : {} }
    let divStyle = {
      ...defaultStyle.frame
      , ...textStyle
      , ...additionalStyles ? additionalStyles.frame : {}
    }
    divStyle.width += defaultStyle.icon.width + 5
    return (
      <div
        className={styles.main}
        style={divStyle}
      >
        <i
          onClick={onClick}
          className="fa fa-search" />
        <input
          type="text"
          placeholder="Search"
          style={textStyle}
          onKeyUp={this.handleKeyUp}
          ref={n => this.query = n}
          onChange={e => autoSearch && (debounceChange(e.target.value))}
        />
      </div>
    );
  }
}

export default makeExpandingAnimation<{
  handleSearch: (value: string) => void, autoSearch?: boolean
}, any>(catchOutSideCLick(SearchPanel));