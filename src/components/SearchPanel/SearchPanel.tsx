import * as React from 'react';
const styles = require('./searchpanel.scss');
import {observer} from 'mobx-react';
const debounce = require('lodash/debounce');
import {Component} from 'react';
import makeCatchoutside from '../../Hoc/makeCatchoutside';

interface ISearchPanelProps {
  handleSearch: (value: string) => void;
  isOpen: boolean;
  onSubmit: () => void;
  additionalStyles: any;
  onClick: () => void;
  autoSearch: boolean;
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
};

const animationStyle = {
  transition: 'width 0.2s ease'
};

function makeExpandingAnimation<Props, State>(
  Comp: new () => Component<
    Props & {
      additionalStyles: any;
    },
    State
  >
) {
  return class ExpandingAnimationWrapper extends React.PureComponent<
    Props,
    any
  > {
    render() {
      return <Comp additionalStyles={{text: animationStyle}} {...this.props} />;
    }
  };
}

@observer
@makeCatchoutside
class SearchPanel extends React.Component<ISearchPanelProps, any> {
  query: HTMLInputElement;
  state = {
    isOpen: false
  };
  handleChange = (value: string) => {
    debounce(() => this.props.handleSearch(value), 500)();
  };

  handleKeyUp = event => {
    const ENTER_KEY = 13;
    if (event.keyCode === ENTER_KEY) {
      event.preventDefault();
      this.props.handleSearch(event.target.value);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isOpen) {
      this.query.focus();
    }
  }

  handleTouchOutside = () => {
    this.setState({isOpen: false});
  };

  handleToggle = () => {
    this.setState(prev => ({isOpen: !prev.isOpen}));
  };
  render() {
    const debounceChange = debounce(this.handleChange, 599);
    const {additionalStyles, autoSearch} = this.props;
    const {isOpen} = this.state;
    let textStyle = isOpen ? defaultStyle.open : defaultStyle.close;
    textStyle = {
      ...textStyle,
      ...additionalStyles ? additionalStyles.text : {}
    };
    let divStyle = {
      ...defaultStyle.frame,
      ...textStyle,
      ...additionalStyles ? additionalStyles.frame : {}
    };
    divStyle.width += defaultStyle.icon.width + 5;
    return (
      <div className={styles.main} style={divStyle}>
        <i onClick={this.handleToggle} className="fa fa-search" />
        <input
          type="text"
          placeholder="Search"
          style={textStyle}
          onKeyUp={this.handleKeyUp}
          ref={n => (this.query = n)}
          onChange={e => autoSearch && debounceChange(e.target.value)}
        />
      </div>
    );
  }
}

export default makeExpandingAnimation<
  {
    handleSearch: (value: string) => void;
    autoSearch?: boolean;
  },
  any
>(SearchPanel);
