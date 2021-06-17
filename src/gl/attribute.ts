import { Buffer, TypedArray } from "./buffer";
import { WEBGL } from "./const";

function floatAttrib(this: Attribute) {
    this.gl.enableVertexAttribArray(this.location);
    this.gl.vertexAttribPointer(
        this.location,
        this.components,
        WEBGL.FLOAT,
        this.normalized,
        this.stride,
        this.offset
    );
}

function intAttrib(this: Attribute) {
    this.gl.enableVertexAttribArray(this.location);
    this.gl.vertexAttribIPointer(this.location,
        this.components,
        this.type,
        this.stride,
        this.offset);
}

/**
 * A single vertex attribute.
 */
export class Attribute {
    public readonly gl: WebGL2RenderingContext;
    public readonly buffer: Buffer<TypedArray>;
    public readonly location: number;
    public readonly elementSize: number;
    public readonly type: number;
    public readonly components: number;
    public readonly byteLength: number;
    public readonly offset: number;
    public readonly normalized: boolean;
    public stride: number;

    public readonly bind: () => void;

    constructor(
        gl: WebGL2RenderingContext,
        buffer: Buffer<TypedArray>,
        location: number,
        components: number,
        offset: number = 0,
        normalized: boolean = false,
        castToFloat: boolean = false,
    ) {
        const info = elementInfo(buffer.inner);

        this.gl = gl;
        this.buffer = buffer;
        this.location = location;
        this.type = info.type;
        this.elementSize = info.elementSize;
        this.components = components;
        this.byteLength = this.components * this.elementSize;
        this.offset = offset;
        this.normalized = normalized;
        this.stride = 0;

        this.bind = (info.isFloat || castToFloat)
            ? floatAttrib.bind(this)
            : intAttrib.bind(this);
    }
}

const Float32ElementInfo = { elementSize: 4, type: WEBGL.FLOAT, isFloat: true };
const Int32ElementInfo = { elementSize: 4, type: WEBGL.INT, isFloat: false };
const Int16ElementInfo = { elementSize: 2, type: WEBGL.SHORT, isFloat: false };
const Int8ElementInfo = { elementSize: 1, type: WEBGL.BYTE, isFloat: false };
const Uint32ElementInfo = { elementSize: 4, type: WEBGL.UNSIGNED_INT, isFloat: false };
const Uint16ElementInfo = { elementSize: 2, type: WEBGL.UNSIGNED_SHORT, isFloat: false };
const Uint8ElementInfo = { elementSize: 1, type: WEBGL.UNSIGNED_BYTE, isFloat: false };
function elementInfo(array: TypedArray) {
    if (array instanceof Float32Array) return Float32ElementInfo;
    if (array instanceof Int32Array) return Int32ElementInfo;
    if (array instanceof Uint32Array) return Uint32ElementInfo;
    if (array instanceof Uint8Array) return Uint8ElementInfo;
    if (array instanceof Int8Array) return Int8ElementInfo;
    if (array instanceof Int16Array) return Int16ElementInfo;
    if (array instanceof Uint16Array) return Uint16ElementInfo;
    throw new Error(`Element size of type ${(<any>array).constructor.name} is unknown`);
}
