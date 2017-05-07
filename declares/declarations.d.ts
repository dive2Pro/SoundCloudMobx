// declare module 'react-hot-loader';
declare module 'soundcloud';
declare module 'js-cookie'
declare module 'mobx-remotedev';
declare module 'qs';
declare module 'react-blur';
declare var System;
declare module '*.scss';

interface Window{
    HTMLDivElement:typeof HTMLDivElement
    attachEvent(event: string, listener: EventListener): boolean;
    detachEvent(event: string, listener: EventListener): void;
}

