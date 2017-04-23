/**
 * Created by hyc on 17-3-22.
 */
import * as React from "react";
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { findRootParentOffSet as findRootParentOffSet$ } from '../../services/utils'
const styles = require('./style.scss');
interface IInputRange {
  vertical?: boolean,
  wide?: number
  data: any
  toolTip?: boolean
  onDragStart?: (value: string | number) => void;
  onDragIng?: (value: string | number) => void,
  onDragEnd?: (value: string | number) => void,
  value?: string | number
  defaultWide?: number,
  backgroundColor?: string,
  defaultColor?: string,
  defaultTransition?: string
  dotStyle?: {}
  cusProcessStyle?: {}
  contaiStyle?: {}
}


@observer
class InputRange extends React.Component<IInputRange, any> {
  public static defaultProps: IInputRange = {
    data: 500,
    defaultWide: 10,
    backgroundColor: 'chocolate',
    defaultColor: 'beige',
    defaultTransition: '0.3s ease-out, box-shadow 0.3s ease-out',
    cusProcessStyle: {},
    contaiStyle: {}
  };

  @observable currentValue = 0;
  @observable isMoving = false;
  @observable maxWidth = 100;

  rootOffsetLeft: any;
  downPosition: number;
  downPointY: any;
  tt: HTMLElement
  container: HTMLElement
  process: HTMLElement
  dot: HTMLElement

  @computed get dotStyle() {
    let position = this.position;
    let style = {};
    if (this.isVertical) {
      // const difHeight = this.dot ? this.dot.offsetHeight / 2 : 0
      style = { transform: `translateY(${position}px)` };
    } else {
      style = { transform: `translateX(${position}px)` };
    }
    if (!this.isMoving) {
      style = {
        ...style,
        transition: 'transform ' + this.props.defaultTransition
      };
    }
    const dotStyle = this.props.dotStyle
    return { ...style, ...dotStyle };
  }

  @computed get position() {
    const [, h] = this.positionLimit;
    const position = this.currentValue / this.gap;
    return this.isVertical ? h - position : position;
  }

  @computed get ProcessStyle() {
    const position = this.position;
    let style = this.isVertical
      ? {
        height: position + 'px',
        width: '100%',
        backgroundColor: this.props.defaultColor,
        left: '-8.5px'
      }
      : {
        width: position + 'px',
        height: '100%',
        backgroundColor: this.props.backgroundColor
      };

    if (this.isMoving) {
      style = {
        ...style,
        transition: ''
      };
    } else {
      const trans = this.isVertical
        ? { transition: 'height ' + this.props.defaultTransition }
        : { transition: 'width ' + this.props.defaultTransition };
      style = {
        ...style,
        ...trans
      };
    }
    return { ...style, ...this.props.cusProcessStyle };
  }

  @computed get ttStyle() {
    let style = {};
    if (this.props.toolTip) {
      style = {
        visibility: 'visible'
      };
    } else {
      style = {
        visibility: 'hidden'
      };
    }
    return style;
  }

  @computed get offLength(): number {
    if (!this.process.style) { return 0 }
    const {
      paddingLeft,
      marginLeft,
      paddingTop,
      marginTop
    } = this.process.style;

    if (this.isVertical) {
      if (paddingTop != null && marginTop != null) {
        return +(this.container.offsetTop + (paddingTop) + marginTop)
      }
      return this.container.offsetTop
    } else {
      if (paddingLeft && marginLeft) {
        return +(this.container.offsetLeft + paddingLeft + marginLeft)
      }
      return this.container.offsetLeft + this.findRootParentOffSet();
    }
  }

  @computed get gap(): number {
    const max = this.valueLimit[1];
    const [, width] = this.positionLimit;
    return parseFloat((max / width).toFixed(2)) || 1;
  }

  @computed get ContainerStyle() {
    // const [l, h] = this.valueLimit;
    let style = {};
    let wide = this.props.wide;
    const wided = wide ? wide + 'px' : '100%'
    if (this.isVertical) {
      style = {
        width: this.props.defaultWide + 'px',
        height: wided,
        backgroundColor: this.props.backgroundColor
      };
    } else {
      style = {
        height: this.props.defaultWide + 'px',
        width: wided,
        backgroundColor: this.props.defaultColor
      };
    }
    return { ...style, ...this.props.contaiStyle };
  }

  @computed get valueLimit() {
    const max = this.props.data;
    return [0, max];
  }

  @computed get positionLimit() {
    let max = this.props.wide
    if (!!max === false) { max = this.maxWidth };
    return max ? [0, max] : [0, this.props.defaultWide || 0];

  }

  @computed get isVertical() {
    return !!this.props.vertical;
  }




  actualPosition(pos: number) {
    let value = pos * this.gap;
    // console.log(value, pos, this.gap)
    const [, h] = this.valueLimit;
    if (this.isVertical) {
      value = h - value;
    }
    this.setValue(value);
  }
  @action toggleMoving(b: boolean) {
    this.isMoving = b
  }
  @action setValue(value: string | number) {
    const [l, h] = this.valueLimit;
    value = value < l ? l : value > h ? h : value;
    this.currentValue = Math.round(+value);

    const { onDragIng } = this.props;
    if (this.isMoving && onDragIng) {
      const process = this.getCurrentProcssPercent()
      onDragIng(process);
    }
  }

  getCurrentProcssPercent() {
    const v = +(this.currentValue / this.valueLimit[1]).toFixed(2)
    return Number.isNaN(v) ? 1 : v;
  }

  findRootParentOffSet = () => {
    if (this.rootOffsetLeft) { return this.rootOffsetLeft; }
    let root: any = this.container
    this.rootOffsetLeft = findRootParentOffSet$(root)
    return this.rootOffsetLeft
  }

  @action setMax(length: number) {

    this.maxWidth = length;
  }


  handleMouseDown = (e: any) => {
    if (e.target == this.dot) {
      this.toggleMoving(true)
      this.downPointY = e.pageY
      this.downPosition = this.position
    }
    const { onDragStart } = this.props;
    if (onDragStart) {
      onDragStart(this.currentValue);
    }
    this.container.addEventListener('mouseup', this.handleMoveend, false);
    window.addEventListener('mousemove', this.handleMovind, false);
    window.addEventListener('mouseup', this.handleMoveend, false);
    this.dot.addEventListener('mousemove', this.handleMovind, false);
    this.dot.addEventListener('mouseup', this.handleMovind, false);
  };

  handleMovind = (e: any) => {
    if (!this.isMoving) { return };
    e.preventDefault();
    this.actualPosition(this.getPos(e));
  };

  handleMoveend = (e: any) => {
    e.preventDefault();
    this.actualPosition(this.getPos(e));
    this.toggleMoving(false)
    this.downPointY = 0
    this.downPosition = 0;
    const { onDragEnd } = this.props;
    if (onDragEnd) {
      const process = this.getCurrentProcssPercent()
      onDragEnd(process);
    }
    window.removeEventListener('mousemove', this.handleMovind, false);
    window.removeEventListener('mouseup', this.handleMoveend, false);
  };
  isCurrentValueIntheRange() {
    const value = this.currentValue
    const [l, h] = this.valueLimit
    return value !== l && value !== h
  }
  getPos(e: any): number {
    let pos
    if (this.isVertical) {
      // 如果是垂直状态,且 不在移动状态,则直接赋值
      if (!this.isMoving) {
        pos = e.offsetY
      } else {
        // 如果是垂直状态 在移动状态 
        const diff = (e.pageY - this.downPointY);
        if (diff == 0) {
          return this.position
        }
        pos = diff + this.downPosition;
      }
      return pos
    } else {
      pos = e.clientX;
    }
    return pos - this.offLength;
  }

  componentWillReceiveProps(nextProps: any) {
    if (nextProps.value && nextProps.value !== this.currentValue) {

      this.setValue(nextProps.value)
    }
  }

  componentWillUnmount() {
    this.dot.removeEventListener('mousemove', this.handleMovind, false);
    this.process.removeEventListener('mouseup', this.handleMoveend, false);
    this.process.removeEventListener('mouseup', this.handleMoveend, false);
    window.removeEventListener('mousemove', this.handleMovind, false);
    window.removeEventListener('mouseup', this.handleMoveend, false);
  }

  componentDidMount() {
    this.setMax(this.container.offsetWidth);
    let value = this.props.value;
    if (value) {
      this.setValue(value);
    }

  }

  render() {
    const value = this.currentValue;

    return (
      <div className={styles.main}>
        <div
          onMouseDown={this.handleMouseDown}
          style={this.ContainerStyle}
          ref={r => this.container = r}
          className={styles.input_container}
        >
          <div
            onMouseDown={this.handleMouseDown}
            ref={n => this.dot = n}
            className={styles.input_dot}
            style={this.dotStyle}
          >
            <span
              style={this.ttStyle}
              ref={n => this.tt = n}
              className={styles.input_tooltip}
            >
              {value}
            </span>
          </div>
          <div
            className={styles.process}
            style={this.ProcessStyle}
            ref={n => this.process = n}
          />

        </div>
      </div>
    );
  }
}
export default InputRange;
