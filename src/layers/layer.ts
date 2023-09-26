
import { CanvasRenderingContext2D } from 'canvas'

export interface Layer {
    render(ctx: CanvasRenderingContext2D): void
    clone(): Layer
}

export interface TranslatableLayer extends Layer {
    x: number
    y: number
}
