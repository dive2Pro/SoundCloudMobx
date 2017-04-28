
declare module 'react-router-dom'{
    export type RDAM = ()=>void

    import {Component} from 'react'
    export type IReactComponent<P> = React.StatelessComponent<P> | React.ComponentClass<P>;
    export type IWrappedComponent<P> = {
        wrappedComponent: IReactComponent<P>;
        wrappedInstance: React.ReactElement<P>;
    }

    export function withRouter<P>(component:IReactComponent<P>);

    interface RouteProps{
        path?: string,
        exact?: boolean,
        strict?: boolean,
        component?: (any)=>JSX.Element|React.ComponentClass<any>,
        render?: (any)=>JSX.Element,
        children?: any,
        location?:object
    }
    export class Route extends Component<RouteProps,any>{}

    interface BrowserRouterProps{
        basename?: string,
        forceRefresh?: boolean,
        getUserConfirmation?: ()=>void,
        keyLength?: number,
        children?: React.ReactNode
    }
    export class BrowserRouter extends Component<BrowserRouterProps,any>{}
    interface LinkProps {
        onClick?: RDAM,
        target?: string,
        replace?: boolean,
        to: string|object
    }
    export class Link extends Component<LinkProps& React.HTMLAttributes<any>,any>{}

    interface NavLinkProps extends  LinkProps{
        activeClassName?:string,
        className?:string,
        activeStyle?:object,
        style?:object,
        isActive?: boolean,
    }
    export class NavLink extends Component<NavLinkProps&React.HTMLAttributes<any>,any>{}
    interface SwitchProps{
        children?: any,
        location?: object
    }

    export class Switch extends Component<SwitchProps,any>{}

    interface StaticRouterProps{
        context: object,
        basename?: string,
        location?:string|object
    }
    export class StaticRouter extends Component<StaticRouterProps,any>{}

    interface RedirectProps{
        push?: boolean,
        from?: string,
        to:string|object
    }

    export class Redirect extends Component<RedirectProps,any>{}

    export type history={
        length :number
        action :string
        location :location
        push:(path,state?)=>void
        replace:(path, state?)=>void
        go(n:number),
        goBack()
        goForward()
        block(prompt);
    }
    export type location={
        pathname:string,
        search:string,
        hash:string,
        state:string
    }

    export type match={
        params :object
        isExact :boolean
        path :string
        url :string
    }

}
