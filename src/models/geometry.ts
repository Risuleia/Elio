export type Vec2 = {
    x: number,
    y: number
}

export type Rect = {
    x: number,
    y: number,
    width: number,
    height: number
}

export type AABB = Rect

declare const __brand: unique symbol
export type Color = string & { readonly [__brand]: 'Color' }
export function Color(value: string): Color {
    if (!/^#([0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value)) {
        throw new Error(`Invalid color: ${value}`);
    }

    return value as Color
}