import { Resource, UseAfterFree } from "../common";
import * as WEBGL from "./const";

// TODO: cubemap, array, 3d, float textures

export interface TextureBaseOptions {
  target?: GLenum;
  internalFormat?: GLenum;
  format?: GLenum;
  type?: GLenum;
  wrap_s?: GLenum;
  wrap_t?: GLenum;
  filter_min?: GLenum;
  filter_mag?: GLenum;
  mipmap?: boolean;
  premultiplyAlpha?: boolean;
}

export interface FromBuffer extends TextureBaseOptions {
  buffer: ArrayBufferView;
  offset?: number;
  width: number;
  height: number;
}

export interface FromImage extends TextureBaseOptions {
  image: HTMLImageElement;
}

export interface FromPath extends TextureBaseOptions {
  path: string;
}

export type TextureOptions = FromImage | FromBuffer | FromPath;

export class Texture implements Resource {
  public readonly handle: WebGLTexture;
  public readonly target: GLenum;

  constructor(
    public readonly id: number,
    public readonly gl: WebGL2RenderingContext,
    public readonly options?: TextureOptions
  ) {
    const handle = gl.createTexture();
    if (!handle) throw new Error(`Failed to create texture`);
    this.handle = handle;

    if (options) sample(gl, this.handle, options);
    this.target = options?.target ?? WEBGL.TEXTURE_2D;
  }

  bind(slot: TextureSlot) {
    this.gl.bindTexture(this.target, this.handle);
    this.gl.activeTexture(WEBGL.TEXTURE0 + slot);
  }

  unbind() {
    this.gl.bindTexture(this.target, null);
  }

  free() {
    this.gl.deleteTexture(this.handle);
    this.bind = UseAfterFree;
    this.unbind = UseAfterFree;
    this.free = UseAfterFree;
  }
}

function sample(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  options: TextureOptions
) {
  if ("image" in options) {
    if (options.image.complete) {
      // from image (sync)
      sampleImage(gl, texture, options);
    } else {
      // from image (async)
      options.image.addEventListener("load", () =>
        sampleImage(gl, texture, options)
      );
    }
  } else if ("path" in options) {
    const image = new Image();
    image.src = options.path;
    image.addEventListener("load", () =>
      sampleImage(gl, texture, { ...options, image })
    );
  } else {
    sampleBuffer(gl, texture, options);
  }
}

function sampleImage(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  options: FromImage
) {
  gl.bindTexture(options.target ?? WEBGL.TEXTURE_2D, texture);
  pre(gl, options);
  gl.texImage2D(
    options.target ?? WEBGL.TEXTURE_2D,
    0,
    options.internalFormat ?? WEBGL.RGBA,
    options.format ?? WEBGL.RGBA,
    options.type ?? WEBGL.UNSIGNED_BYTE,
    options.image
  );
  post(gl, options);
}

function sampleBuffer(
  gl: WebGL2RenderingContext,
  texture: WebGLTexture,
  options: FromBuffer
) {
  gl.bindTexture(options.target ?? WEBGL.TEXTURE_2D, texture);
  pre(gl, options);
  // from buffer (sync)
  gl.texImage2D(
    options.target ?? WEBGL.TEXTURE_2D,
    0,
    options.internalFormat ?? WEBGL.RGBA,
    options.width,
    options.height,
    0,
    options.format ?? WEBGL.RGBA,
    options.type ?? WEBGL.UNSIGNED_BYTE,
    options.buffer,
    options.offset ?? 0
  );
  post(gl, options);
}

function pre(gl: WebGL2RenderingContext, options: TextureBaseOptions) {
  if (options.premultiplyAlpha === true) {
    gl.pixelStorei(WEBGL.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  }
  gl.texParameteri(
    options.target ?? WEBGL.TEXTURE_2D,
    WEBGL.TEXTURE_WRAP_S,
    options.wrap_s ?? WEBGL.CLAMP_TO_EDGE
  );
  gl.texParameteri(
    options.target ?? WEBGL.TEXTURE_2D,
    WEBGL.TEXTURE_WRAP_T,
    options.wrap_t ?? WEBGL.CLAMP_TO_EDGE
  );
  gl.texParameteri(
    options.target ?? WEBGL.TEXTURE_2D,
    WEBGL.TEXTURE_MIN_FILTER,
    options.filter_min ?? WEBGL.NEAREST
  );
  gl.texParameteri(
    options.target ?? WEBGL.TEXTURE_2D,
    WEBGL.TEXTURE_MAG_FILTER,
    options.filter_mag ?? WEBGL.NEAREST
  );
}

function post(gl: WebGL2RenderingContext, options: TextureBaseOptions) {
  if (options.mipmap !== false) {
    gl.generateMipmap(options.target ?? WEBGL.TEXTURE_2D);
  }
}

export type TextureSlot =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31;
