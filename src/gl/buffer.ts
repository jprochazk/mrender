import { Resource, UseAfterFree } from "../common";
import { typeinfo } from "./attribute";
import * as WEBGL from "./const";

export type TypedArray =
  | Uint8Array
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array;

/**
 * Usage hint
 */
export enum Usage {
  /** `STATIC_DRAW` */
  Static = WEBGL.STATIC_DRAW,
  /** `DYNAMIC_DRAW` / `STREAM_DRAW` */
  Dynamic = WEBGL.DYNAMIC_DRAW,
}

/**
 * Buffer bind target
 */
export enum Target {
  /** `ARRAY_BUFFER` */
  Vertex = WEBGL.ARRAY_BUFFER,
  /** `ELEMENT_ARRAY_BUFFER` */
  Index = WEBGL.ELEMENT_ARRAY_BUFFER,
  /** `COPY_READ_BUFFER` */
  Source = WEBGL.COPY_READ_BUFFER,
  /** `COPY_WRITE_BUFFER` */
  Destination = WEBGL.COPY_WRITE_BUFFER,
  /** `TRANSFORM_FEEDBACK_BUFFER` */
  TransformFeedback = WEBGL.TRANSFORM_FEEDBACK_BUFFER,
  /** `UNIFORM_BUFFER` */
  Uniform = WEBGL.UNIFORM_BUFFER,
  /** `PIXEL_PACK_BUFFER` */
  PixelPack = WEBGL.PIXEL_PACK_BUFFER,
  /** `PIXEL_UNPACK_BUFFER` */
  PixelUnpack = WEBGL.PIXEL_UNPACK_BUFFER,
}

export class Buffer<Type extends TypedArray = TypedArray> implements Resource {
  private previousTarget: GLenum;
  public readonly handle: WebGLBuffer;
  public readonly type: number;
  constructor(
    public readonly id: number,
    public readonly gl: WebGL2RenderingContext,
    public readonly inner: Type,
    upload = false,
    public target = WEBGL.ARRAY_BUFFER,
    public usage = WEBGL.STATIC_DRAW,
    type?: number
  ) {
    this.type = type ?? typeinfo(this.inner).type;

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

  get length() {
    return this.inner.length;
  }

  /**
   * Upload the Buffer's data to the GPU.
   *
   * For performance reasons, this neither binds nor unbinds the target.
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
