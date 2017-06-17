import * as React from 'react';
import {Component} from 'react';
import {spring, TransitionMotion, presets} from 'react-motion';
import {observer} from 'mobx-react';

interface ImakeOpacityTransitionProp {
  datas?: Object[];
  rootClazz?: string;
  itemClazz?: string;
  getDefaultItemStyle: (item: Object, index: number) => Object;
  getItemStyle: (item: Object, index: number) => Object;
  willEnter: () => Object;
  willLeave: () => Object;
}
interface ImakeOpacityTransitionState {
  datas?: Object[];
}
export interface IAddtionalProps {
  interpolatedStyles?: {style: Object; key: string; data: Object}[];
  className?: string;
}

const transitionMixin = {
  componentDidMount: function() {
    // this.onchildDidMount()
    console.log(this);
  },
  componentWillUnmount: function() {
    // this.onchildUnmount()
  }
};

function patch(target, funcName) {
  const base = target[funcName];
  const mixinFunc = transitionMixin[funcName];
  const f = !base
    ? mixinFunc
    : function() {
        base.apply(this.arguments);
        mixinFunc.apply(this, arguments);
      };
  // console.log(target)
  // target[funcName] = f
}

function mixinLifecycleEvents(target) {
  const newChild = React.cloneElement(target);
  ['componentDidMount', 'componentWillUnmount'].forEach(function(funcName) {
    patch(newChild, funcName);
  });
  return newChild;
}

function makeOpacityTransition<Props, State>(
  Target: (new () => Component<Props & IAddtionalProps, State>),
  TargetClassName?: string
) {
  // tslint:disable-next-line:class-name
  @observer
  class MakeOpacityTransitionComponent extends Component<
    Props & ImakeOpacityTransitionProp,
    any
  > {
    state = {
      datas: new Array<Object>()
    };
    clonedChildren: any[];
    componentWillMount() {
      this.clonedChildren = React.Children.map(
        this.props.children,
        (child, index) => {
          return mixinLifecycleEvents(child);
        }
      );
    }

    componentDidMount() {
      const datas: any = this.props.datas;
      this.setState({
        datas: datas
          ? datas.map(this.geneDataItem)
          : React.Children.map(this.props.children, this.geneItemWithoutData)
      });
      const {children} = this.props;
    }

    componentWillReceiveProps(nextProps) {
      // console.log(nextProps)
      nextProps.datas &&
        this.setState({
          datas: nextProps.datas.map(this.geneDataItem)
        });
    }

    geneItemWithoutData = (item, index) => {
      return this.geneDataItem(null, index);
    };

    geneDataItem = (item, index) => {
      return {
        style: this.props.getDefaultItemStyle(item, index),
        data: item,
        key: `item-${index}`
      };
    };
    getDefaultStyles = () => {
      return this.state.datas.map(this.geneDataItem);
    };

    getStyles = () => {
      return this.state.datas.map((item, index) => {
        return {
          ...item,
          style: this.props.getItemStyle(item, index)
        };
      });
    };

    render() {
      return (
        <TransitionMotion
          defaultStyles={this.getDefaultStyles()}
          styles={this.getStyles()}
          willEnter={this.props.willEnter}
          willLeave={this.props.willLeave}
          style={{width: 'inherit', height: 'inherit'}}
        >
          {interpolatedStyles =>
            <Target
              {...this.props}
              className={TargetClassName}
              interpolatedStyles={interpolatedStyles}
              children={this.clonedChildren}
            />}
        </TransitionMotion>
      );
    }
  }
  return MakeOpacityTransitionComponent;
}

export default makeOpacityTransition;
