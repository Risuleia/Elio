export type Camera = {
    x: number,
    y: number,
    zoom: number
}

export function createDefaultCamera(): Camera {
    return {
        x: 0,
        y: 0,
        zoom: 1
    }
}

export type CameraConstraints = {
    minZoom: number,
    maxZoom: number
}