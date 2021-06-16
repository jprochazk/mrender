import { Shader, ShaderSource } from "./shader";

export class Context {
    private canvas: HTMLCanvasElement;
    private context: WebGL2RenderingContext;
    constructor() {
        const canvas = document.createElement("canvas");
        if (!canvas) throw new Error(`Failed to create canvas`);
        this.canvas = canvas;
        this.canvas.style.width = "100%";
        this.canvas.style.height = "100%";

        const context = this.canvas.getContext("webgl2");
        if (!context) throw new Error(`Failed to create WebGL2 context`);
        this.context = context;
    }

    get gl() { return this.context }

    appendTo(element: HTMLElement) {
        element.append(this.canvas);
        this.updateSize();
    }
    prependTo(element: HTMLElement) {
        element.prepend(this.canvas);
        this.updateSize();
    }

    updateSize() {
        if (this.canvas.width !== this.canvas.clientWidth ||
            this.canvas.height !== this.canvas.clientHeight) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
        }
    }

    createShader(source: ShaderSource): Shader {
        return new Shader(this.gl, source);
    }
}