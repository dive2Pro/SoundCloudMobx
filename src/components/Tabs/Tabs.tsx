import * as React from 'react';
import { computed, observable, autorun, expr, action } from 'mobx';
import { observer } from 'mobx-react';
const styles = require('./tabs.scss')

interface ITabsProps {
  initialSelectedIndex?: number,
  tabTemplateStyle?: object
  onActive?: (value: string, index: number) => void
  inkBarStyle?: object,
  selectedTextColor?: string
}
@observer
class Tabs extends React.Component<ITabsProps, any> {
  link: HTMLDivElement;
  @observable index = 0;
  @observable width = 0;
  tabContent: any[] = [];

  getSelectedStyle = (i) => {

    const root = {
      color: this.index == i ? this.props.selectedTextColor : "#333"
    }
    const tempStyle = this.props.tabTemplateStyle
    return { ...tempStyle, ...root }
  };

  @action componentWillMount() {
    this.index = this.props.initialSelectedIndex || 0
  }

  tabs = () => {
    this.tabContent = [];
    return this.getTabs().map((c, i) => {
      this.tabContent.push(c.props.children);
      const tab = React.cloneElement(
        c,
        {
          key: i,
          index: i,
          style: this.getSelectedStyle(i),
          onClick: e => {
            e.preventDefault();
            this.handleOnClick(i, tab);
          }
        },
        c.props.children
      );
      return tab;
    });
  };

  getTabs = (): React.ComponentElement<any, any>[] => {
    const tabs: any[] = [];
    React.Children.forEach(this.props.children,
      (child: React.ComponentElement<any, any>, index) => {
        tabs.push(child);
      });
    return tabs;
  };

  @action handleOnClick = (index, tab) => {
    const position = tab.props.index;
    this.index = +position;
    if (this.props.onActive) {
      this.props.onActive(this.tabContent[index], index);
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
      transform: `translateX(${width * i + 'px'})`,
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