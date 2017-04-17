import * as React from 'react';
import { computed, observable, autorun, expr, action } from 'mobx';
import { observer } from 'mobx-react';
const styles = require('./tabs.scss')

interface ITabsProps {
  initialSelectedIndex?: number,
  tabTemplateStyle?: object
  onActive?: (value: string, index: number) => void
  inkBarStyle?: object,
  selectedTextColor?: string,
  value: any
}

const TabTemplatestyles = {
  width: '100%',
  position: 'relative',
  textAlign: 'initial',
}
const TabTemplate = ({ children, selected, style }: any) => {
  const templateStyle: any = { ...TabTemplatestyles, style }
  if (!selected) {
    templateStyle.height = 0,
      templateStyle.overflow = 'hidden'
  }
  return (
    <div style={templateStyle}>
      {children}
    </div>
  )
}

@observer
class Tabs extends React.Component<ITabsProps, any> {
  link: HTMLDivElement;
  @observable index = 0;
  @observable width = 0;
  tabContent: any[] = [];

  getSelectedStyle = (i) => {

    const root = {
      color: this.index === i ? this.props.selectedTextColor : "#333"
    }
    const tempStyle = this.props.tabTemplateStyle
    return { ...tempStyle, ...root }
  };

  componentWillMount() {

    this.setIndex(this.props.initialSelectedIndex || 0)
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.value != undefined) {

      const index = this.getSelectedIndex(nextProps)
      if (index == -1) {
        this.setIndex(index)
      }

    }
  }

  componentWillReceiveProps(nextProps) {

  }
  @action setIndex = (index: number) => {
    this.index = index
  }

  getSelectedIndex = (props): number => {
    const valueLink = this.getValueLink(props)

    let selectedIndex = -1;
    this.getTabs().forEach((tab, index) => {
      if (tab.props.value === valueLink.value) {
        selectedIndex = index
      }
    })

    return selectedIndex
  }

  getValueLink = (props) => {
    return { value: props.value }
  }

  getSelected = (tab: any, i: number): boolean => {
    const valueLink = this.getValueLink(this.props)

    return valueLink.value ? valueLink.value === tab.props.value : this.index === i
  }

  tabs = () => {
    const { tabTemplateStyle } = this.props
    this.tabContent = [];
    return this.getTabs().map((c, index) => {
      if (!c.type || c.type['uiName'] !== 'Tab') {
        console.warn(`Tabs only accepts  Tab component as children,${c.type} found ${index + 1} of Tabs`);
      }

      this.tabContent.push(c.props.children ? React.createElement(
        TabTemplate, {
          key: index,
          selected: this.getSelected(c, index)
          , style: tabTemplateStyle
        },
        c.props.children) : undefined);

      const tab = React.cloneElement(
        c,
        {
          key: 'tab - ' + index,
          index: index,
          selected: this.getSelected(c, index),
          style: this.getSelectedStyle(index),
          handleClick: this.handleOnClick
        },
        c.props.children
      );
      return tab;
    });
  };

  getTabs = (): React.ComponentElement<any, any>[] => {
    const tabs: any[] = [];
    React.Children.forEach(this.props.children, (child: React.ComponentElement<any, any>, index) => {
      tabs.push(child);
    });
    return tabs;
  };

  @action handleOnClick = (value, event, tab) => {
    const index = tab.props.index;
    // const valueLink = this.getValueLink()
    this.index = index;
    if (this.props.onActive) {
      this.props.onActive(value, index);
    }
  };

  @action componentDidMount() {
    this.width = this.link.offsetWidth;
  }

  @computed get linkStyle() {
    const i = this.index;

    const width = 1 / this.getTabs().length * this.width;
    const { inkBarStyle } = this.props
    return {
      width: width + 'px',
      transition: 'transform 0.3s ease',
      transform: `translateX(${width * this.index + 'px'})`,
      background: '#0f0',
      height: '100%'
      , ...inkBarStyle,
    };
  }

  render() {
    return (
      <div
        ref={n => this.link = n}
        className={styles.tabs_container}>
        <div className={styles.tabs}>
          {this.tabs()}
        </div>
        <div className={styles.link}>
          <div style={this.linkStyle} />
        </div>

      </div>
    );
  }
}
export default Tabs;