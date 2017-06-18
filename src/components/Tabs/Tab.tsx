import * as React from 'react';

interface ITabProps {
  label: string;
  index?: number;
  handleClick?: (value: object, event: any, tab: Tab) => void;
  selected?: boolean;
  style?: any;
  value: any;
  icon?: any;
}

class Tab extends React.Component<ITabProps, any> {
  static uiName = 'Tab';
  handleClick = event => {
    event.preventDefault();
    if (this.props.handleClick) {
      this.props.handleClick(this.props.value, event, this);
    }
  };
  render() {
    const {icon, label, style} = this.props;
    let iconElement;
    if (icon && React.isValidElement(icon)) {
      const iconProps = {
        style: {
          fontSize: 24,
          color: style.color,
          marginBottom: label ? 5 : 0
        },
        color: ''
      };
      if (icon.type['uiName'] != 'FontIcon') {
        iconProps.color = style.color;
      }
      iconElement = React.cloneElement(icon, {});
    }
    return (
      <div style={Object.assign(style)} onClick={this.handleClick}>
        {iconElement}
        {label}
      </div>
    );
  }
}

export default Tab;
