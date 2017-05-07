/**
 * Created by hyc on 17-5-1.
 */
export function createClientXY(x: number, y: number) {
    return {clientX: x, clientY: y};
}

export function createStartTouchEventObject({x = 0, y = 0}) {
    return {touches: [createClientXY(x, y)]};
}

export function createMoveTouchEventObject({x = 0, y = 0}) {
    return {changedTouches: [createClientXY(x, y)]};
}
