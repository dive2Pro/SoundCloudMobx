
declare module 'react-hot-loader';
declare module 'soundcloud';
declare module 'js-cookie'
declare module 'mobx-remotedev';
declare module 'react-router-dom';

declare module 'react-css-modules' {
    interface Options {
        allowMultiple?: boolean;
        errorWhenNotFound?: boolean;
    }

    module Decorator {
        interface Props {
            styles?: any;
            styleName?: string;
        }
    }

    interface Decorator {
        (defaultStyles: any, options?: Options): any;
    }

    const Decorator: Decorator;

    export default Decorator;
}

declare module '*.scss' {
  const content: any;
  export default content;
}