import { Resource, UseAfterFree } from "../common";
import { WEBGL } from "./const";

export type TypedArray =
    | Uint8Array
    | Uint16Array
    | Uint32Array
    | Int8Array
    | Int16Array
    | Int32Array
    | Float32Array
    ;

/**
 * Usage hint
 */
export namespace Usage {
    /** `STATIC_DRAW` */
    export const Static = WEBGL.STATIC_DRAW;
    /** `DYNAMIC_DRAW` */
    export const Dynamic = WEBGL.DYNAMIC_DRAW;
}

/**
 * Buffer bind target
 */
export namespace Target {
    /** `ARRAY_BUFFER` */
    export const Vertex = WEBGL.ARRAY_BUFFER;
    /** `ELEMENT_ARRAY_BUFFER` */
    export const Index = WEBGL.ELEMENT_ARRAY_BUFFER;
    /** `COPY_READ_BUFFER` */
    export const IndexSource = WEBGL.COPY_READ_BUFFER;
    /** `COPY_WRITE_BUFFER` */
    export const IndexDestination = WEBGL.COPY_WRITE_BUFFER;
    /** `TRANSFORM_FEEDBACK_BUFFER` */
    export const IndexTransformFeedback = WEBGL.TRANSFORM_FEEDBACK_BUFFER;
    /** `UNIFORM_BUFFER` */
    export const IndexUniform = WEBGL.UNIFORM_BUFFER;
    /** `PIXEL_PACK_BUFFER` */
    export const IndexPixelPack = WEBGL.PIXEL_PACK_BUFFER;
    /** `PIXEL_UNPACK_BUFFER` */
    export const IndexPixelUnpack = WEBGL.PIXEL_UNPACK_BUFFER;
}

export class Buffer<Type extends TypedArray> implements Resource {
    private previousTarget: GLenum;
    public readonly handle: WebGLBuffer;
    constructor(
        public readonly id: number,
        public readonly gl: WebGL2RenderingContext,
        public readonly inner: Type,
        upload = false,
        public target = Target.Vertex,
        public usage = Usage.Static,
    ) {
        const handle = gl.createBuffer();
        if (!handle) throw new Error(`Failed to create buffer`);
        this.handle = handle;

        this.previousTarget = this.target;

        if (upload) {
            const previous = this.gl.getParameter(WEBGL.ARRAY_BUFFER_BINDING);
            this.gl.bindBuffer(this.target, this.handle);
            this.gl.bufferData(this.target, this.inner, this.usage);
            this.gl.bindBuffer(this.target, previous);
        }
    }

    /**
     * Upload the Buffer's data to the GPU.
     * 
     * For performance reasons, this neither binds nor unbinds the usage.
     * To be certain you're not doing anything wrong, use it like so:
     * ```ts
     * buffer.bind().upload().unbind();
     * ```
     * And only remove either the bind or unbind call if you are completely
     * sure that it won't break anything.
     */
    upload(): this {
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.inner, this.gl.STATIC_DRAW);
        return this;
    }

    /**
     * Binds the buffer to `this.target`.
     * 
     * `this.target` is mutable, so change it if you want to bind to
     * a different target.
     */
    bind(): this {
        this.gl.bindBuffer(this.target, this.handle);
        this.previousTarget = this.target;
        return this;
    }

    /**
     * Unbinds the buffer from where it was previously bound.
     */
    unbind(): this {
        // TODO: @DEBUG check if we're unbinding *this* buffer
        this.gl.bindBuffer(this.previousTarget, null);
        return this;
    }

    free() {
        this.gl.deleteBuffer(this.handle);
        this.free = UseAfterFree;
        this.bind = UseAfterFree;
        this.unbind = UseAfterFree;
        this.upload = UseAfterFree;
    }
}