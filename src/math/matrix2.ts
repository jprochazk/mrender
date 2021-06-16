import { EPSILON, fhypot } from "./common";
import { ReadonlyVector2 } from "./vector2";

export interface ReadonlyMatrix2 extends Array<number> {
    clone(out?: Matrix2): Matrix2;
    determinant(): number;
    frob(): number;
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @param L the lower triangular matrix
     * @param D the diagonal matrix
     * @param U the upper triangular matrix
     */
    LDU(L: ReadonlyMatrix2, D: ReadonlyMatrix2, U: ReadonlyMatrix2): [Matrix2, Matrix2, Matrix2];
    equals(that: ReadonlyMatrix2): boolean;
}

export class Matrix2 extends Array<number> {
    constructor(
        m00: number, m01: number,
        m10: number, m11: number
    ) {
        super(4);
        this[0] = m00; this[1] = m01;
        this[2] = m10; this[3] = m11;
    }

    clone(out = new Matrix2(1, 0, 0, 1)): Matrix2 {
        out[0] = this[0]; out[1] = this[1];
        out[2] = this[2]; out[3] = this[3];
        return out;
    }

    static identity(): Matrix2 {
        return new Matrix2(
            1, 0,
            0, 1
        );
    }

    add(that: ReadonlyMatrix2): this {
        this[0] = this[0] + that[0];
        this[1] = this[1] + that[1];
        this[2] = this[2] + that[2];
        this[3] = this[3] + that[3];
        return this;
    }

    sub(that: ReadonlyMatrix2): this {
        this[0] = this[0] - that[0];
        this[1] = this[1] - that[1];
        this[2] = this[2] - that[2];
        this[3] = this[3] - that[3];
        return this;
    }

    mult(that: ReadonlyMatrix2): this {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];
        const b0 = that[0];
        const b1 = that[1];
        const b2 = that[2];
        const b3 = that[3];
        this[0] = a0 * b0 + a2 * b1;
        this[1] = a1 * b0 + a3 * b1;
        this[2] = a0 * b2 + a2 * b3;
        this[3] = a1 * b2 + a3 * b3;
        return this;
    }

    multScalar(value: number): this {
        this[0] = this[0] * value;
        this[1] = this[1] * value;
        this[2] = this[2] * value;
        this[3] = this[3] * value;
        return this;
    }

    transpose(): this {
        const a1 = this[1];
        this[1] = this[2];
        this[2] = a1;
        return this;
    }

    invert(): this | null {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];
        let det = a0 * a3 - a2 * a1;
        if (!det) {
            return null;
        }
        det = 1.0 / det;
        this[0] = a3 * det;
        this[1] = -a1 * det;
        this[2] = -a2 * det;
        this[3] = a0 * det;
        return this;
    }

    adjoint(): this {
        const a0 = this[0];
        this[0] = this[3];
        this[1] = -this[1];
        this[2] = -this[2];
        this[3] = a0;
        return this;
    }

    determinant(): number {
        return this[0] * this[3] - this[2] * this[1];
    }

    scale(value: ReadonlyVector2): this {
        const v0 = value[0];
        const v1 = value[1];
        this[0] = this[0] * v0;
        this[1] = this[1] * v0;
        this[2] = this[2] * v1;
        this[3] = this[3] * v1;
        return this;
    }

    rotate(angle: number): this {
        const a0 = this[0];
        const a1 = this[1];
        const a2 = this[2];
        const a3 = this[3];
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        this[0] = a0 * c + a2 * s;
        this[1] = a1 * c + a3 * s;
        this[2] = a0 * -s + a2 * c;
        this[3] = a1 * -s + a3 * c;
        return this;
    }

    frob(): number {
        return fhypot(this[0], this[1], this[2], this[3]);
    }
    /**
     * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
     * @param L the lower triangular matrix
     * @param D the diagonal matrix
     * @param U the upper triangular matrix
     */
    LDU(L: Matrix2, D: Matrix2, U: Matrix2): [Matrix2, Matrix2, Matrix2] {
        L[2] = this[2] / this[0];
        U[0] = this[0];
        U[1] = this[1];
        U[3] = this[3] - L[2] * U[1];
        return [L, D, U];
    }

    static scaled(value: ReadonlyVector2): Matrix2 {
        return new Matrix2(
            value[0], 0,
            0, value[1]
        );
    }

    static rotated(angle: number): Matrix2 {
        const s = Math.sin(angle);
        const c = Math.cos(angle);
        return new Matrix2(
            c, s,
            -s, c
        );
    }

    equals(that: ReadonlyMatrix2): boolean {
        for (let i = 0; i < this.length; ++i) {
            const margin = EPSILON * Math.max(1.0, Math.abs(this[i]), Math.abs(that[i]));
            if (Math.abs(this[i] - that[i]) <= margin) {
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

export function mat2(
    m00 = 1, m01 = 0,
    m10 = 0, m11 = 1
): Matrix2 {
    return new Matrix2(
        m00, m01,
        m10, m11
    );
}