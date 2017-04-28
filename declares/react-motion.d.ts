declare module 'react-motion' {
    interface MotionProps {

        defaultStyle?: number,
        style: object | number
        // PropTypes.objectOf(PropTypes.oneOfType([
        //                                               PropTypes.number,
        //                                               PropTypes.object,
        //                                           ])).isRequired,
        children?: React.ReactNode,
        onRest?: () => void,
    }
    import {Component} from 'react'

    export class Motion extends Component<MotionProps, any> {
    }

    export interface Config {
        stiffness: number,
        damping: number,
        precision?: number,
    }

    export function spring(val: number, config?: Config);

    export class Presets {
        [name: string]: Config
    }

    export const presets: {
        noWobble: { stiffness: 170, damping: 26 }, // the default, if nothing provided
        gentle: { stiffness: 120, damping: 14 },
        wobbly: { stiffness: 180, damping: 12 },
        stiff: { stiffness: 210, damping: 20 },
    }

    interface IStaggeredMotionProps {
        defaultStyles: object[],
        styles: (...args) => void,
        children?: React.ReactNode
    }

    interface ITransitionMotion {
        defaultStyles: ({ key: string, data: any, style: any })[],
        styles: { key: string, data: any, style:any}[]|any,
        children?: any ,
        willEnter?: () => object,
        willLeave?: () => object,
        didLeave?: () => void,
    }
    export class TransitionMotion extends Component<ITransitionMotion&React.HTMLAttributes<any>, any> {
    }

    export class StaggeredMotion extends Component<IStaggeredMotionProps&React.HTMLAttributes<any>, any> {
    }

}