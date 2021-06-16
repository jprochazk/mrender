import { clamp, EPSILON, fhypot, Randomizer } from "./common";
import { Matrix4 } from "./matrix4";
import { Quaternion } from "./quaternion";

export interface ReadonlyVector4 extends ReadonlyArray<number> {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    readonly w: number;

    clone(out?: Vector4): Vector4;
    /**
     * Creates a new vector using signs from components of `this`
     */
    sign(): Vector4;
    /**
     * Euclidean distance between `this` and `that`
     */
    dist(that: ReadonlyVector4): number;
    /**
     * Square of euclidean distance between `this` and `that`
     */
    dist2(that: ReadonlyVector4): number;
    /**
     * Length of `this`
     */
    len(): number;
    /**
     * Squared length of `this`
     */
    len2(): number;
    /**
     * Dot product of `this` and `that`
     */
    dot(that: ReadonlyVector4): number;
    /**
     * Creates a new vector via the cross product of `this` and `that`
     */
    cross(a: ReadonlyVector4, b: ReadonlyVector4): Vector4;
    /**
     * Comparison between components of `this` and `that` with a margin of `epsilon`.
     * 
     * If you need exact comparison, pass in `0` for `epsilon`.
     */
    equals(that: ReadonlyVector4, epsilon?: number): boolean;
    /**
     * Converts `this` to a hex string in the format `RRGGBBAA`
     */
    toHex(): string;
}

/**
 * A 4-dimensional vector
 */
export class Vector4 extends Array<number> {
    static X: ReadonlyVector4 = new Vector4(1, 0, 0, 0);
    static Y: ReadonlyVector4 = new Vector4(0, 1, 0, 0);
    static Z: ReadonlyVector4 = new Vector4(0, 0, 1, 0);
    static W: ReadonlyVector4 = new Vector4(0, 0, 0, 1);

    constructor(x: number, y: number, z: number, w: number) {
        super(4);
        this[0] = x;
        this[1] = y;
        this[2] = z;
        this[3] = w;
    }
    get x() { return this[0] }
    set x(v: number) { this[0] = v }
    get y() { return this[1] }
    set y(v: number) { this[1] = v }
    get z() { return this[2] }
    set z(v: number) { this[2] = v }
    get w() { return this[3] }
    set w(v: number) { this[3] = v }

    clone(out = new Vector4(0, 0, 0, 0)): Vector4 {
        out[0] = this[0];
        out[1] = this[1];
        out[2] = this[2];
        out[3] = this[3];
        return out;
    }
    /**
     * Adds `that` to `this`
     */
    add(that: ReadonlyVector4): this {
        this[0] += that[0];
        this[1] += that[1];
        this[2] += that[2];
        this[3] += that[3];
        return this;
    }
    /**
     * Subtracts `that` from `this`
     */
    sub(that: ReadonlyVector4): this {
        this[0] -= that[0];
        this[1] -= that[1];
        this[2] -= that[2];
        this[3] -= that[3];
        return this;
    }
    /**
     * Multiplies `this` by `that`
     */
    mult(that: ReadonlyVector4): this {
        this[0] *= that[0];
        this[1] *= that[1];
        this[2] *= that[2];
        this[3] *= that[3];
        return this;
    }
    /**
     * Divides `this` by `that`
     */
    div(that: Vector4): this {
        this[0] /= that[0];
        this[1] /= that[1];
        this[2] /= that[2];
        this[3] /= that[3];
        return this;
    }
    /**
     * Component-wise minimum of `a` and `b`
     */
    static min(a: ReadonlyVector4, b: ReadonlyVector4): Vector4 {
        return new Vector4(
            Math.min(a[0], b[0]),
            Math.min(a[1], b[1]),
            Math.min(a[2], b[2]),
            Math.min(a[3], b[3])
        );
    }
    /**
     * Component-wise maximum of `a` and `b`
     */
    static max(a: ReadonlyVector4, b: ReadonlyVector4): Vector4 {
        return new Vector4(
            Math.max(a[0], b[0]),
            Math.max(a[1], b[1]),
            Math.max(a[2], b[2]),
            Math.max(a[3], b[3])
        );
    }
    /**
     * Creates a new vector using signs from components of `this`
     */
    sign(): Vector4 {
        return new Vector4(
            Math.sign(this[0]),
            Math.sign(this[1]),
            Math.sign(this[2]),
            Math.sign(this[3])
        );
    }
    /**
     * Ceils components of `this`
     */
    ceil(): this {
        this[0] = Math.ceil(this[0]);
        this[1] = Math.ceil(this[1]);
        this[2] = Math.ceil(this[2]);
        this[3] = Math.ceil(this[3]);
        return this;
    }
    /**
     * Floors components of `this`
     */
    floor(): this {
        this[0] = Math.floor(this[0]);
        this[1] = Math.floor(this[1]);
        this[2] = Math.floor(this[2]);
        this[3] = Math.floor(this[3]);
        return this;
    }
    /**
     * Rounds components of `this`
     */
    round(): this {
        this[0] = Math.round(this[0]);
        this[1] = Math.round(this[1]);
        this[2] = Math.round(this[2]);
        this[3] = Math.round(this[3]);
        return this;
    }
    /**
     * Scales components of `this` by `value`
     */
    scale(value: number): this {
        this[0] *= value;
        this[1] *= value;
        this[2] *= value;
        this[3] *= value;
        return this;
    }
    /**
     * Euclidean distance between `this` and `that`
     */
    dist(that: ReadonlyVector4): number {
        return fhypot(
            that[0] - this[0],
            that[1] - this[1],
            that[2] - this[2],
            that[3] - this[3],
        );
    }
    /**
     * Square of euclidean distance between `this` and `that`
     */
    dist2(that: ReadonlyVector4): number {
        const dx = that[0] - this[0];
        const dy = that[1] - this[1];
        const dz = that[2] - this[2];
        const dw = that[3] - this[3];
        return dx * dx + dy * dy + dz * dz + dw * dw;
    }
    /**
     * Length of `this`
     */
    len(): number {
        return fhypot(this[0], this[1], this[2], this[3]);
    }
    /**
     * Squared length of `this`
     */
    len2(): number {
        return this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3];
    }
    /**
     * Component-wise clamp of `this` between `min` and `max`
     */
    clamp(min: ReadonlyVector4, max: ReadonlyVector4): Vector4 {
        return new Vector4(
            clamp(this[0], min[0], max[0]),
            clamp(this[1], min[1], max[1]),
            clamp(this[2], min[2], max[2]),
            clamp(this[3], min[3], max[3]),
        );
    }
    /**
     * Negates components of `this`
     */
    negate(): this {
        this[0] = -this[0];
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = -this[3];
        return this;
    }
    /**
     * Inverts components of `this`
     */
    invert(): this {
        this[0] = 1 / this[0];
        this[1] = 1 / this[1];
        this[2] = 1 / this[2];
        this[3] = 1 / this[3];
        return this;
    }
    /**
     * Normalizes components of `this` to range (0, 1)
     */
    normalize(): this {
        let len = this[0] * this[0] + this[1] * this[1] + this[2] * this[2] + this[3] * this[3];
        if (len > 0) {
            len = 1 / Math.sqrt(len);
        }
        this[0] *= len;
        this[1] *= len;
        this[2] *= len;
        this[3] *= len;
        return this;
    }
    /**
     * Dot product of `this` and `that`
     */
    dot(that: ReadonlyVector4): number {
        return this[0] * that[0] + this[1] * that[1] + this[2] * that[2] + this[3] * that[3];
    }
    /**
     * Creates a new vector via the cross product of `this`, `a`, and `b`
     */
    cross(a: ReadonlyVector4, b: ReadonlyVector4): Vector4 {
        const A = a[0] * b[1] - a[1] * b[0];
        const B = a[0] * b[2] - a[2] * b[0];
        const C = a[0] * b[3] - a[3] * b[0];
        const D = a[1] * b[2] - a[2] * b[1];
        const E = a[1] * b[3] - a[3] * b[1];
        const F = a[2] * b[3] - a[3] * b[2];
        const G = this[0];
        const H = this[1];
        const I = this[2];
        const J = this[3];
        return new Vector4(
            H * F - I * E + J * D,
            -(G * F) + I * C - J * B,
            G * E - H * C + J * A,
            -(G * D) + H * B - I * A
        );
    }
    /**
     * Creates a new vector by linearly interpolating between `a` and `b` with weight `t`
     */
    static lerp(a: ReadonlyVector4, b: ReadonlyVector4, t: number): Vector4 {
        return new Vector4(
            a[0] + t * (b[0] - a[0]),
            a[1] + t * (b[1] - a[1]),
            a[2] + t * (b[2] - a[2]),
            a[3] + t * (b[3] - a[3])
        );
    }
    /**
     * Transforms `this` using `mat`
     */
    transformM4(mat: Matrix4): this {
        this[0] = mat[0] * this[0] + mat[4] * this[1] + mat[8] * this[2] + mat[12] * this[3];
        this[1] = mat[1] * this[0] + mat[5] * this[1] + mat[9] * this[2] + mat[13] * this[3];
        this[2] = mat[2] * this[0] + mat[6] * this[1] + mat[10] * this[2] + mat[14] * this[3];
        this[3] = mat[3] * this[0] + mat[7] * this[1] + mat[11] * this[2] + mat[15] * this[3];
        return this;
    }
    /**
     * Transforms `this` using `quat`
     * 
     * `quat` can also be a dual quaternion
     */
    transformQ(quat: Quaternion): this {
        const x = this[0];
        const y = this[1];
        const z = this[2];
        const qx = quat[0];
        const qy = quat[1];
        const qz = quat[2];
        const qw = quat[3];
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = -qx * x - qy * y - qz * z;
        this[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        // this[3] = this[3]
        return this;
    }
    /**
     * Sets all components of `this` to zero
     */
    zero(): this {
        this[0] = 0;
        this[1] = 0;
        this[2] = 0;
        return this;
    }
    /**
     * Generates a random normalized vector.
     * 
     * `randomizer.random()` should return a value between 0 and 1.
     */
    static random(rand: Randomizer = Math.random): Vector4 {
        // Marsaglia, George. Choosing a Point from the Surface of a
        // Sphere. Ann. Math. Statist. 43 (1972), no. 2, 645--646.
        // http://projecteuclid.org/euclid.aoms/1177692644;
        let v1, v2, v3, v4;
        let s1, s2;
        do {
            v1 = rand() * 2 - 1;
            v2 = rand() * 2 - 1;
            s1 = v1 * v1 + v2 * v2;
        } while (s1 >= 1);
        do {
            v3 = rand() * 2 - 1;
            v4 = rand() * 2 - 1;
            s2 = v3 * v3 + v4 * v4;
        } while (s2 >= 1);
        const d = Math.sqrt((1 - s1) / s2);
        return new Vector4(
            v1,
            v2,
            v3 * d,
            v4 * d
        );
    }
    /**
     * Comparison between components of `this` and `that` with a margin of `epsilon`.
     * 
     * If you need exact comparison, pass in `0` for `epsilon`.
     */
    equals(that: ReadonlyVector4, epsilon: number = EPSILON): boolean {
        return (
            Math.abs(this[0] - that[0]) <= epsilon &&
            Math.abs(this[1] - that[1]) <= epsilon &&
            Math.abs(this[2] - that[2]) <= epsilon
        );
    }

    toString(): string {
        return `(${this.map(v => v.toFixed(2)).join(", ")})`;
    }

    /**
     * Converts a hex string in the format `0xRRGGBBAA` or `RRGGBBAA` to a vector,
     * where each component will have a resulting value between 0 and 1.
     */
    static fromHex(hex: string): Vector4 {
        if (hex.startsWith("0x")) hex = hex.substring(2);
        return new Vector4(
            Number(`0x${hex.substring(0, 2)}`) / 255,
            Number(`0x${hex.substring(2, 4)}`) / 255,
            Number(`0x${hex.substring(4, 6)}`) / 255,
            Number(`0x${hex.substring(6, 8)}`) / 255
        );
    }
    /**
     * Converts `this` to a hex string in the format `RRGGBBAA`
     */
    toHex(): string {
        let r = this[0].toString(16);
        if (r.length === 1) r = `0${r}`;
        let g = this[1].toString(16);
        if (g.length === 1) g = `0${g}`;
        let b = this[2].toString(16);
        if (b.length === 1) b = `0${b}`;
        let a = this[3].toString(16);
        if (a.length === 1) a = `0${a}`;
        return `${r}${g}${b}${a}`
    }

    get [Symbol.toStringTag](): string { return this.constructor.name }
}

export function vec4(x = 0.0, y = 0.0, z = 0.0, w = 0.0): Vector4 {
    return new Vector4(x, y, z, w);
}
