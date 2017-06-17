/**
 * Created by hyc on 17-4-26.
 */
const on = (() => {
  if (document.addEventListener) {
    return function(
      node: EventTarget,
      eventName: string,
      handler: EventListenerOrEventListenerObject,
      capture?: boolean
    ) {
      return node.addEventListener(eventName, handler, capture || false);
    };
  } else if (window.attachEvent) {
    return function(
      node: any,
      eventName: string,
      handler: (node?: any, e?: Event) => void
    ) {
      return node.attachEvent('on' + eventName, function(e) {
        e = e || window.event;
        e.target = e.target || e.srcElement;
        e.currentTarget = node;
        handler.call(node, e);
      });
    };
  } else {
    return function(node: EventTarget, eventName: string, handler?: Function) {
      return (node['on' + eventName] = null);
    };
  }
})();

const off = (() => {
  if (document.removeEventListener) {
    return function(
      node: EventTarget,
      eventName: string,
      handler: EventListenerOrEventListenerObject,
      capture?: boolean
    ) {
      return node.removeEventListener(eventName, handler, capture || false);
    };
  } else if (window.detachEvent) {
    return function(
      node,
      eventName: string,
      handler: EventListenerOrEventListenerObject
    ) {
      return node.detachEvent('on' + eventName, handler);
    };
  } else {
    return function(node: EventTarget, eventName: string) {
      return (node['on' + eventName] = null);
    };
  }
})();

export const docMethods = {
  addEvent: on,
  removeEvent: off
};
