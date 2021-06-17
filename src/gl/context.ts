import { vec4, Vector4 } from "../math";
import { AttributeArrayBuilder } from "./attribArray";
import { Buffer, TypedArray } from "./buffer";
import { Shader, ShaderSource } from "./shader";

export class Context {
    private guidSequence: number = 0;

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

    nextGUID() { return this.guidSequence++ }

    private _background = vec4(1, 1, 1, 1);
    get background(): Vector4 { return this._background }
    set background(value: Vector4 | [number, number, number, number]) {
        this._background = vec4(...value);
        this.gl.clearColor(
            this._background[0],
            this._background[1],
            this._background[2],
            this._background[3],
        );
    }

    appendTo(element: HTMLElement) {
        element.append(this.canvas);
        this.resize();
    }
    prependTo(element: HTMLElement) {
        element.prepend(this.canvas);
        this.resize();
    }

    /**
     * Clears the specific `mask` bits.
     * 
     * @param mask default: `COLOR_BUFFER_BIT | DEPTH_BUFFER_BIT`
     */
    clear(mask = this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT) {
        this.gl.clear(mask);
    }

    /**
     * Resizes the canvas to match the DOM element's width/height.
     * 
     * This should be called at the start of every frame.
     */
    resize() {
        if (this.canvas.width !== this.canvas.clientWidth ||
            this.canvas.height !== this.canvas.clientHeight) {
            this.canvas.width = this.canvas.clientWidth;
            this.canvas.height = this.canvas.clientHeight;
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * Creates a new shader program from vertex and fragment
     * source strings.
     */
    createShader(source: ShaderSource): Shader {
        return new Shader(this.guidSequence++, this.gl, source);
    }

    /**
     * Creates a new buffer from a typed array.
     * 
     * The buffer is created at `slot` and with the specified `usage`.
     * 
     * If `upload` is `true`, also immediately uploads it to the GPU.
     * 
     * @param upload default: `false`
     * @param target default: `ARRAY_BUFFER`
     * @param usage default: `STATIC_DRAW`
     */
    createBuffer<Type extends TypedArray>(
        inner: Type,
        upload = false,
        target = this.gl.ARRAY_BUFFER,
        usage = this.gl.STATIC_DRAW
    ): Buffer<Type> {
        return new Buffer(this.guidSequence++, this.gl, inner, upload, target, usage);
    }

    /**
     * Creates a new attribute array builder.
     * 
     * Attribute arrays are vertex arrays, but they also handle
     * index buffers.
     */
    createAttribArray(): AttributeArrayBuilder {
        return new AttributeArrayBuilder(this.guidSequence++, this.gl);
    }
}