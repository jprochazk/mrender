import { BufferLike, EPSILON, fhypot } from "./common";
import { ReadonlyQuaternion } from "./quaternion";
import { ReadonlyVector3 } from "./vector3";

export interface ReadonlyMatrix4 extends Array<number> {
  clone(out?: Matrix4): Matrix4;
  determinant(): number;
  frob(): number;
  equals(that: ReadonlyMatrix4): boolean;
}

export class Matrix4 extends Array<number> {
  constructor(
    m00: number,
    m01: number,
    m02: number,
    m03: number,
    m10: number,
    m11: number,
    m12: number,
    m13: number,
    m20: number,
    m21: number,
    m22: number,
    m23: number,
    m30: number,
    m31: number,
    m32: number,
    m33: number
  ) {
    super(16);
    this[0] = m00;
    this[1] = m01;
    this[2] = m02;
    this[3] = m03;
    this[4] = m10;
    this[5] = m11;
    this[6] = m12;
    this[7] = m13;
    this[8] = m20;
    this[9] = m21;
    this[10] = m22;
    this[11] = m23;
    this[12] = m30;
    this[13] = m31;
    this[14] = m32;
    this[15] = m33;
  }

  clone(
    out = new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
  ): Matrix4 {
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    out[3] = this[3];
    out[4] = this[4];
    out[5] = this[5];
    out[6] = this[6];
    out[7] = this[7];
    out[8] = this[8];
    out[9] = this[9];
    out[10] = this[10];
    out[11] = this[11];
    out[12] = this[12];
    out[13] = this[13];
    out[14] = this[14];
    out[15] = this[15];
    return out;
  }

  static identity(): Matrix4 {
    return new Matrix4(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  add(that: ReadonlyMatrix4): this {
    this[0] = this[0] + that[0];
    this[1] = this[1] + that[1];
    this[2] = this[2] + that[2];
    this[3] = this[3] + that[3];
    this[4] = this[4] + that[4];
    this[5] = this[5] + that[5];
    this[6] = this[6] + that[6];
    this[7] = this[7] + that[7];
    this[8] = this[8] + that[8];
    this[9] = this[9] + that[9];
    this[10] = this[10] + that[10];
    this[11] = this[11] + that[11];
    this[12] = this[12] + that[12];
    this[13] = this[13] + that[13];
    this[14] = this[14] + that[14];
    this[15] = this[15] + that[15];
    return this;
  }

  sub(that: ReadonlyMatrix4): this {
    this[0] = this[0] - that[0];
    this[1] = this[1] - that[1];
    this[2] = this[2] - that[2];
    this[3] = this[3] - that[3];
    this[4] = this[4] - that[4];
    this[5] = this[5] - that[5];
    this[6] = this[6] - that[6];
    this[7] = this[7] - that[7];
    this[8] = this[8] - that[8];
    this[9] = this[9] - that[9];
    this[10] = this[10] - that[10];
    this[11] = this[11] - that[11];
    this[12] = this[12] - that[12];
    this[13] = this[13] - that[13];
    this[14] = this[14] - that[14];
    this[15] = this[15] - that[15];
    return this;
  }

  mult(that: ReadonlyMatrix4): this {
    this[0] = this[0] * that[0];
    this[1] = this[1] * that[1];
    this[2] = this[2] * that[2];
    this[3] = this[3] * that[3];
    this[4] = this[4] * that[4];
    this[5] = this[5] * that[5];
    this[6] = this[6] * that[6];
    this[7] = this[7] * that[7];
    this[8] = this[8] * that[8];
    this[9] = this[9] * that[9];
    this[10] = this[10] * that[10];
    this[11] = this[11] * that[11];
    this[12] = this[12] * that[12];
    this[13] = this[13] * that[13];
    this[14] = this[14] * that[14];
    this[15] = this[15] * that[15];
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
    this[9] = this[9] * value;
    this[10] = this[10] * value;
    this[11] = this[11] * value;
    this[12] = this[12] * value;
    this[13] = this[13] * value;
    this[14] = this[14] * value;
    this[15] = this[15] * value;
    return this;
  }

  adjoint(): this {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];
    this[0] =
      a11 * (a22 * a33 - a23 * a32) -
      a21 * (a12 * a33 - a13 * a32) +
      a31 * (a12 * a23 - a13 * a22);
    this[1] = -(
      a01 * (a22 * a33 - a23 * a32) -
      a21 * (a02 * a33 - a03 * a32) +
      a31 * (a02 * a23 - a03 * a22)
    );
    this[2] =
      a01 * (a12 * a33 - a13 * a32) -
      a11 * (a02 * a33 - a03 * a32) +
      a31 * (a02 * a13 - a03 * a12);
    this[3] = -(
      a01 * (a12 * a23 - a13 * a22) -
      a11 * (a02 * a23 - a03 * a22) +
      a21 * (a02 * a13 - a03 * a12)
    );
    this[4] = -(
      a10 * (a22 * a33 - a23 * a32) -
      a20 * (a12 * a33 - a13 * a32) +
      a30 * (a12 * a23 - a13 * a22)
    );
    this[5] =
      a00 * (a22 * a33 - a23 * a32) -
      a20 * (a02 * a33 - a03 * a32) +
      a30 * (a02 * a23 - a03 * a22);
    this[6] = -(
      a00 * (a12 * a33 - a13 * a32) -
      a10 * (a02 * a33 - a03 * a32) +
      a30 * (a02 * a13 - a03 * a12)
    );
    this[7] =
      a00 * (a12 * a23 - a13 * a22) -
      a10 * (a02 * a23 - a03 * a22) +
      a20 * (a02 * a13 - a03 * a12);
    this[8] =
      a10 * (a21 * a33 - a23 * a31) -
      a20 * (a11 * a33 - a13 * a31) +
      a30 * (a11 * a23 - a13 * a21);
    this[9] = -(
      a00 * (a21 * a33 - a23 * a31) -
      a20 * (a01 * a33 - a03 * a31) +
      a30 * (a01 * a23 - a03 * a21)
    );
    this[10] =
      a00 * (a11 * a33 - a13 * a31) -
      a10 * (a01 * a33 - a03 * a31) +
      a30 * (a01 * a13 - a03 * a11);
    this[11] = -(
      a00 * (a11 * a23 - a13 * a21) -
      a10 * (a01 * a23 - a03 * a21) +
      a20 * (a01 * a13 - a03 * a11)
    );
    this[12] = -(
      a10 * (a21 * a32 - a22 * a31) -
      a20 * (a11 * a32 - a12 * a31) +
      a30 * (a11 * a22 - a12 * a21)
    );
    this[13] =
      a00 * (a21 * a32 - a22 * a31) -
      a20 * (a01 * a32 - a02 * a31) +
      a30 * (a01 * a22 - a02 * a21);
    this[14] = -(
      a00 * (a11 * a32 - a12 * a31) -
      a10 * (a01 * a32 - a02 * a31) +
      a30 * (a01 * a12 - a02 * a11)
    );
    this[15] =
      a00 * (a11 * a22 - a12 * a21) -
      a10 * (a01 * a22 - a02 * a21) +
      a20 * (a01 * a12 - a02 * a11);
    return this;
  }

  determinant(): number {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    return (
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06
    );
  }

  invert(): this | null {
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const a30 = this[12];
    const a31 = this[13];
    const a32 = this[14];
    const a33 = this[15];
    const b00 = a00 * a11 - a01 * a10;
    const b01 = a00 * a12 - a02 * a10;
    const b02 = a00 * a13 - a03 * a10;
    const b03 = a01 * a12 - a02 * a11;
    const b04 = a01 * a13 - a03 * a11;
    const b05 = a02 * a13 - a03 * a12;
    const b06 = a20 * a31 - a21 * a30;
    const b07 = a20 * a32 - a22 * a30;
    const b08 = a20 * a33 - a23 * a30;
    const b09 = a21 * a32 - a22 * a31;
    const b10 = a21 * a33 - a23 * a31;
    const b11 = a22 * a33 - a23 * a32;
    let det =
      b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
    if (!det) {
      return null;
    }
    det = 1.0 / det;
    this[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    this[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    this[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    this[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    this[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    this[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    this[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    this[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    this[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    this[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    this[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    this[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    this[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    this[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    this[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    this[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
    return this;
  }

  transpose(): this {
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a12 = this[6];
    const a13 = this[7];
    const a23 = this[11];
    this[1] = this[4];
    this[2] = this[8];
    this[3] = this[12];
    this[4] = a01;
    this[6] = this[9];
    this[7] = this[13];
    this[8] = a02;
    this[9] = a12;
    this[11] = this[14];
    this[12] = a03;
    this[13] = a13;
    this[14] = a23;
    return this;
  }

  frob(): number {
    return fhypot(
      this[0],
      this[1],
      this[2],
      this[3],
      this[4],
      this[5],
      this[6],
      this[7],
      this[8],
      this[9],
      this[10],
      this[11],
      this[12],
      this[13],
      this[14],
      this[15]
    );
  }

  translate(value: ReadonlyVector3): this {
    const x = value[0];
    const y = value[1];
    const z = value[2];
    this[12] = this[0] * x + this[4] * y + this[8] * z + this[12];
    this[13] = this[1] * x + this[5] * y + this[9] * z + this[13];
    this[14] = this[2] * x + this[6] * y + this[10] * z + this[14];
    this[15] = this[3] * x + this[7] * y + this[11] * z + this[15];
    return this;
  }

  scale(value: ReadonlyVector3): this {
    const x = value[0];
    const y = value[1];
    const z = value[2];
    this[0] = this[0] * x;
    this[1] = this[1] * x;
    this[2] = this[2] * x;
    this[3] = this[3] * x;
    this[4] = this[4] * y;
    this[5] = this[5] * y;
    this[6] = this[6] * y;
    this[7] = this[7] * y;
    this[8] = this[8] * z;
    this[9] = this[9] * z;
    this[10] = this[10] * z;
    this[11] = this[11] * z;
    // this[12] = this[12];
    // this[13] = this[13];
    // this[14] = this[14];
    // this[15] = this[15];
    return this;
  }

  /**
   * Rotate `this` by `angle` radians around `axis`
   */
  rotate(axis: ReadonlyVector3, angle: number): this | null {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = Math.hypot(x, y, z);
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const t = 1 - c;
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    const b00 = x * x * t + c;
    const b01 = y * x * t + z * s;
    const b02 = z * x * t - y * s;
    const b10 = x * y * t - z * s;
    const b11 = y * y * t + c;
    const b12 = z * y * t + x * s;
    const b20 = x * z * t + y * s;
    const b21 = y * z * t - x * s;
    const b22 = z * z * t + c;
    this[0] = a00 * b00 + a10 * b01 + a20 * b02;
    this[1] = a01 * b00 + a11 * b01 + a21 * b02;
    this[2] = a02 * b00 + a12 * b01 + a22 * b02;
    this[3] = a03 * b00 + a13 * b01 + a23 * b02;
    this[4] = a00 * b10 + a10 * b11 + a20 * b12;
    this[5] = a01 * b10 + a11 * b11 + a21 * b12;
    this[6] = a02 * b10 + a12 * b11 + a22 * b12;
    this[7] = a03 * b10 + a13 * b11 + a23 * b12;
    this[8] = a00 * b20 + a10 * b21 + a20 * b22;
    this[9] = a01 * b20 + a11 * b21 + a21 * b22;
    this[10] = a02 * b20 + a12 * b21 + a22 * b22;
    this[11] = a03 * b20 + a13 * b21 + a23 * b22;
    return this;
  }

  /**
   * Rotate `this` by `angle` radians around the X axis
   */
  rotateX(angle: number): this {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    this[4] = a10 * c + a20 * s;
    this[5] = a11 * c + a21 * s;
    this[6] = a12 * c + a22 * s;
    this[7] = a13 * c + a23 * s;
    this[8] = a20 * c - a10 * s;
    this[9] = a21 * c - a11 * s;
    this[10] = a22 * c - a12 * s;
    this[11] = a23 * c - a13 * s;
    return this;
  }

  /**
   * Rotate `this` by `angle` radians around the Y axis
   */
  rotateY(angle: number): this {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a20 = this[8];
    const a21 = this[9];
    const a22 = this[10];
    const a23 = this[11];
    this[0] = a00 * c - a20 * s;
    this[1] = a01 * c - a21 * s;
    this[2] = a02 * c - a22 * s;
    this[3] = a03 * c - a23 * s;
    this[8] = a00 * s + a20 * c;
    this[9] = a01 * s + a21 * c;
    this[10] = a02 * s + a22 * c;
    this[11] = a03 * s + a23 * c;
    return this;
  }

  /**
   * Rotate `this` by `angle` radians around the Z axis
   */
  rotateZ(angle: number): this {
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const a00 = this[0];
    const a01 = this[1];
    const a02 = this[2];
    const a03 = this[3];
    const a10 = this[4];
    const a11 = this[5];
    const a12 = this[6];
    const a13 = this[7];
    this[0] = a00 * c + a10 * s;
    this[1] = a01 * c + a11 * s;
    this[2] = a02 * c + a12 * s;
    this[3] = a03 * c + a13 * s;
    this[4] = a10 * c - a00 * s;
    this[5] = a11 * c - a01 * s;
    this[6] = a12 * c - a02 * s;
    this[7] = a13 * c - a03 * s;
    return this;
  }

  static orthographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    const tx = (left + right) * lr;
    const ty = (top + bottom) * bt;
    const tz = (far + near) * nf;
    return new Matrix4(
      2 * lr,
      0,
      0,
      0,
      0,
      -2 * bt,
      0,
      0,
      0,
      0,
      2 * nf,
      0,
      tx,
      ty,
      tz,
      1
    );
  }

  /**
   * Same as `Matrix4.orthographic`, but works on buffers instead of individual matrices.
   */
  static orthographicB(
    buffer: BufferLike,
    offset: number,
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ) {
    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);
    const tx = (left + right) * lr;
    const ty = (top + bottom) * bt;
    const tz = (far + near) * nf;
    buffer[offset + 0] = 2 * lr;
    buffer[offset + 1] = 0;
    buffer[offset + 2] = 0;
    buffer[offset + 3] = 0;
    buffer[offset + 4] = 0;
    buffer[offset + 5] = -2 * bt;
    buffer[offset + 6] = 0;
    buffer[offset + 7] = 0;
    buffer[offset + 8] = 0;
    buffer[offset + 9] = 0;
    buffer[offset + 10] = 2 * nf;
    buffer[offset + 11] = 0;
    buffer[offset + 12] = tx;
    buffer[offset + 13] = ty;
    buffer[offset + 14] = tz;
    buffer[offset + 15] = 1;
  }

  /**
   * @param fov vertical field of view
   * @param aspect aspect ratio (viewport width/height)
   * @param near near plane
   * @param far far plane (may be infinity, in which case the projection is infinite)
   */
  static perspective(
    fov: number,
    aspect: number,
    near: number,
    far: number
  ): Matrix4 {
    const f = 1.0 / Math.tan(fov / 2);
    const out = new Matrix4(
      f / aspect,
      0,
      0,
      0,
      0,
      f,
      0,
      0,
      0,
      0,
      1,
      -1,
      0,
      0,
      0,
      1
    );
    if (far !== Infinity) {
      const nf = 1 / (near - far);
      out[10] = (far + near) * nf;
      out[14] = 2 * far * near * nf;
    } else {
      out[10] = -1;
      out[14] = -2 * near;
    }
    return out;
  }

  static frustum(
    left: number,
    right: number,
    bottom: number,
    top: number,
    near: number,
    far: number
  ): Matrix4 {
    const rl = 1 / (right - left);
    const tb = 1 / (top - bottom);
    const nf = 1 / (near - far);
    return new Matrix4(
      near * 2 * rl,
      0,
      0,
      0,
      0,
      near * 2 * tb,
      0,
      0,
      (right + left) * rl,
      (top + bottom) * tb,
      (far + near) * nf,
      -1,
      0,
      0,
      far * near * 2 * nf,
      0
    );
  }

  static lookAt(
    eye: ReadonlyVector3,
    center: ReadonlyVector3,
    up: ReadonlyVector3
  ): Matrix4 {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return Matrix4.identity();
    }
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / fhypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = fhypot(x0, x1, x2);
    if (!len) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = fhypot(y0, y1, y2);
    if (!len) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }
    return new Matrix4(
      x0,
      y0,
      z0,
      0,
      x1,
      y1,
      z1,
      0,
      x2,
      y2,
      z2,
      0,
      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1
    );
  }

  /**
   * Same as `Matrix4.lookAt`, but works on buffers instead of individual matrices.
   */
  static lookAtB(
    buffer: BufferLike,
    offset: number,
    eye: ReadonlyVector3,
    center: ReadonlyVector3,
    up: ReadonlyVector3
  ) {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    const centerx = center[0];
    const centery = center[1];
    const centerz = center[2];
    if (
      Math.abs(eyex - centerx) < EPSILON &&
      Math.abs(eyey - centery) < EPSILON &&
      Math.abs(eyez - centerz) < EPSILON
    ) {
      return Matrix4.identity();
    }
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;
    len = 1 / fhypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;
    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = fhypot(x0, x1, x2);
    if (len === 0) {
      x0 = 0;
      x1 = 0;
      x2 = 0;
    } else {
      len = 1 / len;
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    len = fhypot(y0, y1, y2);
    if (len === 0) {
      y0 = 0;
      y1 = 0;
      y2 = 0;
    } else {
      len = 1 / len;
      y0 *= len;
      y1 *= len;
      y2 *= len;
    }

    buffer[offset + 0] = x0;
    buffer[offset + 1] = y0;
    buffer[offset + 2] = z0;
    buffer[offset + 3] = 0;
    buffer[offset + 4] = x1;
    buffer[offset + 5] = y1;
    buffer[offset + 6] = z1;
    buffer[offset + 7] = 0;
    buffer[offset + 8] = x2;
    buffer[offset + 9] = y2;
    buffer[offset + 10] = z2;
    buffer[offset + 11] = 0;
    buffer[offset + 12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    buffer[offset + 13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    buffer[offset + 14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    buffer[offset + 15] = 1;
    return new Matrix4(
      x0,
      y0,
      z0,
      0,
      x1,
      y1,
      z1,
      0,
      x2,
      y2,
      z2,
      0,
      -(x0 * eyex + x1 * eyey + x2 * eyez),
      -(y0 * eyex + y1 * eyey + y2 * eyez),
      -(z0 * eyex + z1 * eyey + z2 * eyez),
      1
    );
  }

  static targetTo(
    eye: ReadonlyVector3,
    target: ReadonlyVector3,
    up: ReadonlyVector3
  ): Matrix4 {
    const eyex = eye[0];
    const eyey = eye[1];
    const eyez = eye[2];
    const upx = up[0];
    const upy = up[1];
    const upz = up[2];
    let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];
    let len = z0 * z0 + z1 * z1 + z2 * z2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      z0 *= len;
      z1 *= len;
      z2 *= len;
    }
    let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;
    len = x0 * x0 + x1 * x1 + x2 * x2;
    if (len > 0) {
      len = 1 / Math.sqrt(len);
      x0 *= len;
      x1 *= len;
      x2 *= len;
    }
    return new Matrix4(
      x0,
      x1,
      x2,
      0,
      z1 * x2 - z2 * x1,
      z2 * x0 - z0 * x2,
      z0 * x1 - z1 * x0,
      0,
      z0,
      z1,
      z2,
      0,
      eyex,
      eyey,
      eyez,
      1
    );
  }

  static fromQuaternion(quat: ReadonlyQuaternion): Matrix4 {
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
    return new Matrix4(
      1 - yy - zz,
      yx + wz,
      zx - wy,
      0,
      yx - wz,
      1 - xx - zz,
      zy + wx,
      0,
      zx + wy,
      zy - wx,
      1 - xx - yy,
      0,
      0,
      0,
      0,
      1
    );
  }

  static translated(value: ReadonlyVector3): Matrix4 {
    return new Matrix4(
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      value[0],
      value[1],
      value[2],
      1
    );
  }

  static scaled(value: ReadonlyVector3): Matrix4 {
    return new Matrix4(
      value[0],
      0,
      0,
      0,
      0,
      value[1],
      0,
      0,
      0,
      0,
      value[2],
      0,
      0,
      0,
      0,
      1
    );
  }

  /**
   * Creates a matrix from rotated by `angle` radians around `axis`
   */
  static rotated(axis: ReadonlyVector3, angle: number): Matrix4 | null {
    let x = axis[0];
    let y = axis[1];
    let z = axis[2];
    let len = fhypot(x, y, z);
    if (len < EPSILON) {
      return null;
    }
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    const t = 1 - c;
    const m00 = x * x * t + c;
    const m01 = y * x * t + z * s;
    const m02 = z * x * t - y * s;
    const m10 = x * y * t - z * s;
    const m11 = y * y * t + c;
    const m12 = z * y * t + x * s;
    const m20 = x * z * t + y * s;
    const m21 = y * z * t - x * s;
    const m22 = z * z * t + c;
    return new Matrix4(
      m00,
      m01,
      m02,
      0,
      m10,
      m11,
      m12,
      0,
      m20,
      m21,
      m22,
      0,
      0,
      0,
      0,
      1
    );
  }

  static translatedScaledRotated(
    pos: ReadonlyVector3,
    scale: ReadonlyVector3,
    rot: ReadonlyQuaternion
  ): Matrix4 {
    const x = rot[0];
    const y = rot[1];
    const z = rot[2];
    const w = rot[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = scale[0];
    const sy = scale[1];
    const sz = scale[2];
    const m00 = (1 - (yy + zz)) * sx;
    const m01 = (xy + wz) * sx;
    const m02 = (xz - wy) * sx;
    const m10 = (xy - wz) * sy;
    const m11 = (1 - (xx + zz)) * sy;
    const m12 = (yz + wx) * sy;
    const m20 = (xz + wy) * sz;
    const m21 = (yz - wx) * sz;
    const m22 = (1 - (xx + yy)) * sz;
    const m30 = pos[0];
    const m31 = pos[1];
    const m32 = pos[2];
    return new Matrix4(
      m00,
      m01,
      m02,
      0,
      m10,
      m11,
      m12,
      0,
      m20,
      m21,
      m22,
      0,
      m30,
      m31,
      m32,
      1
    );
  }

  /**
   * Same as `Matrix4.translatedScaledRotated`, but works on buffers instead of individual matrices.
   *
   * This treats the range `buffer[offset..offset + 16]` as a Matrix4.
   * The range **must** be equal to an identity matrix, or to only have
   * been used with calls to this function.
   */
  static translatedScaledRotatedB(
    buffer: BufferLike,
    offset: number,
    pos: ReadonlyVector3,
    scale: ReadonlyVector3,
    rot: ReadonlyQuaternion
  ) {
    const x = rot[0];
    const y = rot[1];
    const z = rot[2];
    const w = rot[3];
    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;
    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = scale[0];
    const sy = scale[1];
    const sz = scale[2];
    buffer[offset + 0] = (1 - (yy + zz)) * sx;
    buffer[offset + 1] = (xy + wz) * sx;
    buffer[offset + 2] = (xz - wy) * sx;
    buffer[offset + 3] = 0;
    buffer[offset + 4] = (xy - wz) * sy;
    buffer[offset + 5] = (1 - (xx + zz)) * sy;
    buffer[offset + 6] = (yz + wx) * sy;
    buffer[offset + 7] = 0;
    buffer[offset + 8] = (xz + wy) * sz;
    buffer[offset + 9] = (yz - wx) * sz;
    buffer[offset + 10] = (1 - (xx + yy)) * sz;
    buffer[offset + 11] = 0;
    buffer[offset + 12] = pos[0];
    buffer[offset + 13] = pos[1];
    buffer[offset + 14] = pos[2];
    buffer[offset + 15] = 1;
  }

  equals(that: ReadonlyMatrix4): boolean {
    for (let i = 0; i < this.length; ++i) {
      if (
        Math.abs(this[i] - that[i]) <=
        EPSILON * Math.max(1.0, Math.abs(this[i]), Math.abs(that[i]))
      ) {
        continue;
      }
      return false;
    }
    return true;
  }

  toString(): string {
    return `(${this.map((v) => v.toFixed(2)).join(", ")})`;
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }
}

export function mat4(
  m00 = 1,
  m01 = 0,
  m02 = 0,
  m03 = 0,
  m10 = 0,
  m11 = 1,
  m12 = 0,
  m13 = 0,
  m20 = 0,
  m21 = 0,
  m22 = 1,
  m23 = 0,
  m30 = 0,
  m31 = 0,
  m32 = 0,
  m33 = 1
): Matrix4 {
  return new Matrix4(
    m00,
    m01,
    m02,
    m03,
    m10,
    m11,
    m12,
    m13,
    m20,
    m21,
    m22,
    m23,
    m30,
    m31,
    m32,
    m33
  );
}
