
import { EPSILON, fhypot } from "./common";
import { Quaternion } from "./quaternion";
import { ReadonlyVector2 } from "./vector2";

export interface ReadonlyMatrix3 extends Array<number> {
    clone(out?: Matrix3): Matrix3;
    determinant(): number;
    frob(): number;
    equals(that: ReadonlyMatrix3): boolean;
}

/**
 * A 3x3 matrix. 
 * 
 * Stored in column-major layout, which implies that
 * these matrices go on the left side of vectors in
 * GLSL shaders.
 */
export class Matrix3 extends Array<number> {
    constructor(
        m00: number, m01: number, m02: number,
        m10: number, m11: number, m12: number,
        m20: number, m21: number, m22: number,
    ) {
        super(9);
        this[0] = m00; this[1] = m01; this[2] = m02;
        this[3] = m10; this[4] = m11; this[5] = m12;
        this[6] = m20; this[7] = m21; this[8] = m22;
    }

    clone(out = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1)): Matrix3 {
        out[0] = this[0]; out[1] = this[2]; out[2] = this[2];
        out[3] = this[3]; out[4] = this[5]; out[5] = this[5];
        out[6] = this[6]; out[7] = this[8]; out[8] = this[8];
        return out;
    }

    static identity(): Matrix3 {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        );
    }

    add(that: ReadonlyMatrix3): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];
        this[3] = this[3] + that[3];
        this[4] = this[4] + that[4];
        this[5] = this[5] + that[5];
        this[6] = this[6] + that[6];
        this[7] = this[7] + that[7];
        this[8] = this[8] + that[8];
        return this;
    }

    sub(that: ReadonlyMatrix3): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];
        this[3] = this[3] - that[3];
        this[4] = this[4] - that[4];
        this[5] = this[5] - that[5];
        this[6] = this[6] - that[6];
        this[7] = this[7] - that[7];
        this[8] = this[8] - that[8];
        return this;
    }

    mult(that: ReadonlyMatrix3): this {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        const a20 = this[6];
        const a21 = this[7];
        const a22 = this[8];
        const b00 = that[0];
        const b01 = that[1];
        const b02 = that[2];
        const b10 = that[3];
        const b11 = that[4];
        const b12 = that[5];
        const b20 = that[6];
        const b21 = that[7];
        const b22 = that[8];
        this[0] = b00 * a00 + b01 * a10 + b02 * a20;
        this[1] = b00 * a01 + b01 * a11 + b02 * a21;
        this[2] = b00 * a02 + b01 * a12 + b02 * a22;
        this[3] = b10 * a00 + b11 * a10 + b12 * a20;
        this[4] = b10 * a01 + b11 * a11 + b12 * a21;
        this[5] = b10 * a02 + b11 * a12 + b12 * a22;
        this[6] = b20 * a00 + b21 * a10 + b22 * a20;
        this[7] = b20 * a01 + b21 * a11 + b22 * a21;
        this[8] = b20 * a02 + b21 * a12 + b22 * a22;
        return this;
    }

    multScalar(value: number): this {
        this[0] = this[0] * value;
        this[1] = this[1] * value;
        this[2] = this[2] * value;
        this[3] = this[3] * value;
        this[4] = this[4] * value;
        this[5] = this[5] * value;
        this[6] = this[6] * value;
        this[7] = this[7] * value;
        this[8] = this[8] * value;
        return this;
    }

    transpose(): this {
        const a01 = this[1];
        const a02 = this[2];
        const a12 = this[5];
        this[1] = this[3];
        this[2] = this[6];
        this[3] = a01
        this[5] = this[7];
        this[6] = a02
        this[7] = a12
        return this;
    }

    /**
     * Attemps to invert `this`, returning `null` on failure.
     */
    invert(): this | null {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        const a20 = this[6];
        const a21 = this[7];
        const a22 = this[8];
        const b01 = a22 * a11 - a12 * a21;
        const b11 = -a22 * a10 + a12 * a20;
        const b21 = a21 * a10 - a11 * a20;

        let det = a00 * b01 + a01 * b11 + a02 * b21;

        if (!det) {
            return null;
        }

        det = 1.0 / det;
        this[0] = b01 * det;
        this[1] = (-a22 * a01 + a02 * a21) * det;
        this[2] = (a12 * a01 - a02 * a11) * det;
        this[3] = b11 * det;
        this[4] = (a22 * a00 - a02 * a20) * det;
        this[5] = (-a12 * a00 + a02 * a10) * det;
        this[6] = b21 * det;
        this[7] = (-a21 * a00 + a01 * a20) * det;
        this[8] = (a11 * a00 - a01 * a10) * det;
        return this;
    }

    adjoint(): this {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        const a20 = this[6];
        const a21 = this[7];
        const a22 = this[8];
        this[0] = a11 * a22 - a12 * a21;
        this[1] = a02 * a21 - a01 * a22;
        this[2] = a01 * a12 - a02 * a11;
        this[3] = a12 * a20 - a10 * a22;
        this[4] = a00 * a22 - a02 * a20;
        this[5] = a02 * a10 - a00 * a12;
        this[6] = a10 * a21 - a11 * a20;
        this[7] = a01 * a20 - a00 * a21;
        this[8] = a00 * a11 - a01 * a10;
        return this;
    }

    determinant(): number {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        const a20 = this[6];
        const a21 = this[7];
        const a22 = this[8];
        return (
            a00 * (a22 * a11 - a12 * a21) +
            a01 * (-a22 * a10 + a12 * a20) +
            a02 * (a21 * a10 - a11 * a20)
        );
    }

    /**
     * Translate `this` by `value`
     */
    translate(value: ReadonlyVector2): this {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        const a20 = this[6];
        const a21 = this[7];
        const a22 = this[8];
        const x = value[0];
        const y = value[1];
        // this[0] = a00;
        // this[1] = a01;
        // this[2] = a02;
        // this[3] = a10;
        // this[4] = a11;
        // this[5] = a12;
        this[6] = x * a00 + y * a10 + a20;
        this[7] = x * a01 + y * a11 + a21;
        this[8] = x * a02 + y * a12 + a22;
        return this;
    }

    /**
     * Scale `this` by `value`
     */
    scale(value: ReadonlyVector2): this {
        const x = value[0];
        const y = value[1];
        this[0] = x * this[0];
        this[1] = x * this[1];
        this[2] = x * this[2];
        this[3] = y * this[3];
        this[4] = y * this[4];
        this[5] = y * this[5];
        // this[6] = this[6];
        // this[7] = this[7];
        // this[8] = this[8];
        return this;
    }

    /**
     * Rotate `this` by `angle` radians
     */
    rotate(angle: number): this {
        const a00 = this[0];
        const a01 = this[1];
        const a02 = this[2];
        const a10 = this[3];
        const a11 = this[4];
        const a12 = this[5];
        // const a20 = this[6];
        // const a21 = this[7];
        // const a22 = this[8];
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        this[0] = c * a00 + s * a10;
        this[1] = c * a01 + s * a11;
        this[2] = c * a02 + s * a12;
        this[3] = c * a10 - s * a00;
        this[4] = c * a11 - s * a01;
        this[5] = c * a12 - s * a02;
        // this[6] = a20;
        // this[7] = a21;
        // this[8] = a22;
        return this;
    }

    frob(): number {
        return fhypot(
            this[0], this[1], this[2],
            this[3], this[4], this[5],
            this[6], this[7], this[8]
        );
    }

    // TODO: normal matrix?

    /**
     * Create a matrix translated by `value`
     */
    static translated(value: ReadonlyVector2): Matrix3 {
        return new Matrix3(
            1, 0, 0,
            0, 1, 0,
            value[0], value[1], 1
        );
    }

    /**
     * Create a matrix scaled by `value`
     */
    static scaled(value: ReadonlyVector2): Matrix3 {
        return new Matrix3(
            value[0], 0, 0,
            0, value[1], 0,
            0, 0, 1
        );
    }

    /**
     * Create a matrix rotated by `angle` radians
     */
    static rotated(angle: number): Matrix3 {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Matrix3(
            c, s, 0,
            -s, c, 0,
            0, 0, 1
        );
    }

    static fromQuat(quat: Quaternion): Matrix3 {
        const x = quat[0];
        const y = quat[1];
        const z = quat[2];
        const w = quat[3];
        const x2 = x + x;
        const y2 = y + y;
        const z2 = z + z;
        const xx = x * x2;
        const yx = y * x2;
        const yy = y * y2;
        const zx = z * x2;
        const zy = z * y2;
        const zz = z * z2;
        const wx = w * x2;
        const wy = w * y2;
        const wz = w * z2;
        return new Matrix3(
            1 - yy - zz, yx + wz, zx - wy,
            yx - wz, 1 - xx - zz, zy + wx,
            zx + wy, zy - wx, 1 - xx - yy,
        );
    }

    /**
     * Creates a 2D projection matrix with the given bounds
     */
    static projection(width: number, height: number): Matrix3 {
        return new Matrix3(
            2 / width, 0, 0,
            0, -2 / height, 0,
            -1, 1, 1
        );
    }

    equals(that: ReadonlyMatrix3): boolean {
        for (let i = 0; i < 9; ++i) {
            if (Math.abs(this[i] - that[i]) <= EPSILON * Math.max(1.0, Math.abs(this[i]), Math.abs(that[i]))) {
                continue;
            }
            return false;
        }
        return true;
    }

    toString(): string {
        return `(${this.map(v => v.toFixed(2)).join(", ")})`;
    }

    get [Symbol.toStringTag](): string { return this.constructor.name }
}

export function m3(
    m00 = 1, m01 = 0, m02 = 0,
    m10 = 0, m11 = 1, m12 = 0,
    m20 = 0, m21 = 0, m22 = 1,
) {
    return new Matrix3(
        m00, m01, m02,
        m10, m11, m12,
        m20, m21, m22,
    );
}
