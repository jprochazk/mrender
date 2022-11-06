import { BufferLike, EPSILON, fhypot } from "./common";
import { mat3, Matrix3 } from "./matrix3";
import { ReadonlyVector3, vec3, Vector3 } from "./vector3";

export interface ReadonlyQuaternion extends ReadonlyArray<number> {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly w: number;

  clone(out?: Quaternion): Quaternion;
  /**
   * Dot product of `this` and `that`
   */
  dot(that: ReadonlyQuaternion): number;
  /**
   * Length of `this`
   */
  len(): number;
  /**
   * Squared length of `this`
   */
  len2(): number;
  /**
   * Comparison between components of `this` and `that` with a margin of `epsilon`.
   *
   * If you need exact comparison, pass in `0` for `epsilon`.
   */
  equals(that: ReadonlyQuaternion, epsilon?: number): boolean;
}

/**
 * A unit quaternion
 */
export class Quaternion extends Array<number> {
  constructor(x: number, y: number, z: number, w: number) {
    super(4);
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = w;
  }
  get x() {
    return this[0];
  }
  set x(v: number) {
    this[0] = v;
  }
  get y() {
    return this[1];
  }
  set y(v: number) {
    this[1] = v;
  }
  get z() {
    return this[2];
  }
  set z(v: number) {
    this[2] = v;
  }
  get w() {
    return this[3];
  }
  set w(v: number) {
    this[3] = v;
  }

  clone(out = new Quaternion(0, 0, 0, 1)): Quaternion {
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    out[3] = this[3];
    return out;
  }
  identity(): this {
    this[0] = 0;
    this[1] = 0;
    this[2] = 0;
    this[3] = 1;
    return this;
  }
  add(that: ReadonlyQuaternion): this {
    this[0] += that[0];
    this[1] += that[1];
    this[2] += that[2];
    this[3] += that[3];
    return this;
  }
  mult(that: ReadonlyQuaternion): this {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const bx = that[0];
    const by = that[1];
    const bz = that[2];
    const bw = that[3];
    this[0] = ax * bw + aw * bx + ay * bz - az * by;
    this[1] = ay * bw + aw * by + az * bx - ax * bz;
    this[2] = az * bw + aw * bz + ax * by - ay * bx;
    this[3] = aw * bw - ax * bx - ay * by - az * bz;
    return this;
  }
  scale(value: number): this {
    this[0] *= value;
    this[1] *= value;
    this[2] *= value;
    this[3] *= value;
    return this;
  }
  /**
   * Dot product of `this` and `that`
   */
  dot(that: ReadonlyQuaternion): number {
    return (
      this[0] * that[0] +
      this[1] * that[1] +
      this[2] * that[2] +
      this[3] * that[3]
    );
  }
  // TODO: lerp? https://fabiensanglard.net/doom3_documentation/37725-293747_293747.pdf#page=4
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
    return (
      this[0] * this[0] +
      this[1] * this[1] +
      this[2] * this[2] +
      this[3] * this[3]
    );
  }
  /**
   * Normalizes components of `this` to range (0, 1)
   */
  normalize(): this {
    let len =
      this[0] * this[0] +
      this[1] * this[1] +
      this[2] * this[2] +
      this[3] * this[3];
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
   * Inverts `this`
   */
  invert(): this {
    const a0 = this[0];
    const a1 = this[1];
    const a2 = this[2];
    const a3 = this[3];
    const dot = a0 * a0 + a1 * a1 + a2 * a2 + a3 * a3;
    if (dot === 0) {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 0;
    } else {
      const invDot = 1.0 / dot;
      this[0] = -a0 * invDot;
      this[1] = -a1 * invDot;
      this[2] = -a2 * invDot;
      this[3] = a3 * invDot;
    }
    return this;
  }
  /**
   * Calculates the conjugate of a quat
   *
   * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
   */
  conjugate(): this {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    // this[3] = this[3];
    return this;
  }
  /**
   * Rotates `this` around `axis` by `angle` radians
   */
  rotate(axis: ReadonlyVector3, angle: number): this {
    angle = angle * 0.5;
    const s = Math.sin(angle);
    const c = Math.cos(angle);
    this[0] = s * axis[0];
    this[1] = s * axis[1];
    this[2] = s * axis[2];
    this[3] = c;
    return this;
  }
  /**
   * Rotates `this` around the X axis by `angle` radians
   */
  rotateX(angle: number): this {
    angle *= 0.5;
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const bx = Math.sin(angle);
    const bw = Math.cos(angle);
    this[0] = ax * bw + aw * bx;
    this[1] = ay * bw + az * bx;
    this[2] = az * bw - ay * bx;
    this[3] = aw * bw - ax * bx;
    return this;
  }
  /**
   * Rotates `this` around the Y axis by `angle` radians
   */
  rotateY(angle: number): this {
    angle *= 0.5;
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const by = Math.sin(angle);
    const bw = Math.cos(angle);
    this[0] = ax * bw - az * by;
    this[1] = ay * bw + aw * by;
    this[2] = az * bw + ax * by;
    this[3] = aw * bw - ay * by;
    return this;
  }
  /**
   * Rotates `this` around the Z axis by `angle` radians
   */
  rotateZ(angle: number): this {
    angle *= 0.5;
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    const bz = Math.sin(angle);
    const bw = Math.cos(angle);
    this[0] = ax * bw + ay * bz;
    this[1] = ay * bw - ax * bz;
    this[2] = az * bw + aw * bz;
    this[3] = aw * bw - az * bz;
    return this;
  }
  /**
   * Calculates the W component of `this` from its X, Y, and Z components.
   * Assumes that `this` is 1 unit in length. Any existing W component will
   * be ignored.
   */
  calcW(): this {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    this[0] = x;
    this[1] = y;
    this[2] = z;
    this[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
    return this;
  }
  /**
   * Sets `this` to the exponential of `this`
   */
  exp(): this {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    const r = Math.sqrt(x * x + y * y + z * z);
    const et = Math.exp(w);
    const s = r > 0 ? (et * Math.sin(r)) / r : 0;
    this[0] = x * s;
    this[1] = y * s;
    this[2] = z * s;
    this[3] = et * Math.cos(r);
    return this;
  }
  /**
   * Sets `this` to the natural logarithm of `this`
   */
  ln(): this {
    const x = this[0];
    const y = this[1];
    const z = this[2];
    const w = this[3];
    const r = Math.sqrt(x * x + y * y + z * z);
    const t = r > 0 ? Math.atan2(r, w) / r : 0;
    this[0] = x * t;
    this[1] = y * t;
    this[2] = z * t;
    this[3] = 0.5 * Math.log(x * x + y * y + z * z + w * w);
    return this;
  }
  /**
   * Brings this up to a scalar power `scale`
   */
  pow(scale: number): this {
    this.ln();
    this.scale(scale);
    this.exp();
    return this;
  }
  /**
   * Performs a spherical linear interpolation between `this` and `that`
   */
  slerp(that: ReadonlyQuaternion, weight: number): this {
    const ax = this[0];
    const ay = this[1];
    const az = this[2];
    const aw = this[3];
    let bx = that[0];
    let by = that[1];
    let bz = that[2];
    let bw = that[3];
    let omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0.0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1.0 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1.0 - weight) * omega) / sinom;
      scale1 = Math.sin(weight * omega) / sinom;
    } else {
      scale0 = 1.0 - weight;
      scale1 = weight;
    }
    this[0] = scale0 * ax + scale1 * bx;
    this[1] = scale0 * ay + scale1 * by;
    this[2] = scale0 * az + scale1 * bz;
    this[3] = scale0 * aw + scale1 * bw;
    return this;
  }

  private static TV3 = vec3();
  /**
   * Sets `this` to represent the shortest rotation from `a` to `b`.
   *
   * Both vectors are assumed to be unit length.
   */
  rotationOf(a: ReadonlyVector3, b: ReadonlyVector3): this {
    const dot = a.dot(b);
    if (dot < -0.999999) {
      let ca = Vector3.X.cross(a);
      if (ca.len() < 0.000001) ca = Vector3.Y.cross(a);
      ca.normalize();
      this.rotate(ca, Math.PI);
      return this;
    } else if (dot > 0.999999) {
      this[0] = 0;
      this[1] = 0;
      this[2] = 0;
      this[3] = 1;
      return this;
    } else {
      const cab = a.cross(b);
      this[0] = cab[0];
      this[1] = cab[1];
      this[2] = cab[2];
      this[3] = 1 + dot;
      return this.normalize();
    }
  }

  private static TM3 = mat3();
  /**
   * Creates a quaternion with values corresponding to the given axes.
   * Each axis is a vec3 and is expected to be unit length and
   * perpendicular to all other specified axes.
   */
  static fromAxes(
    view: ReadonlyVector3,
    right: ReadonlyVector3,
    up: ReadonlyVector3
  ): Quaternion {
    const m = Quaternion.TM3;
    m[0] = right[0];
    m[3] = right[1];
    m[6] = right[2];
    m[1] = up[0];
    m[4] = up[1];
    m[7] = up[2];
    m[2] = -view[0];
    m[5] = -view[1];
    m[8] = -view[2];
    return Quaternion.fromMat3(m).normalize();
  }
  /**
   * Comparison between components of `this` and `that` with a margin of `epsilon`.
   *
   * If you need exact comparison, pass in `0` for `epsilon`.
   */
  equals(that: ReadonlyQuaternion, epsilon: number = EPSILON): boolean {
    return (
      Math.abs(this[0] - that[0]) <= epsilon &&
      Math.abs(this[1] - that[1]) <= epsilon &&
      Math.abs(this[2] - that[2]) <= epsilon
    );
  }

  toString(): string {
    return `quat(${this.map((v) => v.toFixed(2)).join(", ")})`;
  }

  /**
   * Creates a quaternion from the given 3x3 rotation matrix.
   *
   * NOTE: The quaternion is not normalized.
   */
  static fromMat3(m: Matrix3): Quaternion {
    const out = new Quaternion(0, 0, 0, 1);
    // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
    // article "Quaternion Calculus and Fast Animation".
    const fTrace = m[0] + m[4] + m[8];
    let fRoot;
    if (fTrace > 0.0) {
      fRoot = Math.sqrt(fTrace + 1.0);
      out[3] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[0] = (m[5] - m[7]) * fRoot;
      out[1] = (m[6] - m[2]) * fRoot;
      out[2] = (m[1] - m[3]) * fRoot;
    } else {
      let i = 0;
      if (m[4] > m[0]) i = 1;
      if (m[8] > m[i * 3 + i]) i = 2;
      const j = (i + 1) % 3;
      const k = (i + 2) % 3;
      fRoot = Math.sqrt(m[i * 3 + i] - m[j * 3 + j] - m[k * 3 + k] + 1.0);
      out[i] = 0.5 * fRoot;
      fRoot = 0.5 / fRoot;
      out[3] = (m[j * 3 + k] - m[k * 3 + j]) * fRoot;
      out[j] = (m[j * 3 + i] + m[i * 3 + j]) * fRoot;
      out[k] = (m[k * 3 + i] + m[i * 3 + k]) * fRoot;
    }
    return out;
  }

  private static readonly HALF_TO_RAD = (0.5 * Math.PI) / 180.0;
  /**
   * Creates a quaternion from the given euler angle x, y, z.
   */
  static fromEuler(x: number, y: number, z: number): Quaternion {
    const out = new Quaternion(0, 0, 0, 1);
    const htr = Quaternion.HALF_TO_RAD;
    x *= htr;
    y *= htr;
    z *= htr;
    const sx = Math.sin(x);
    const cx = Math.cos(x);
    const sy = Math.sin(y);
    const cy = Math.cos(y);
    const sz = Math.sin(z);
    const cz = Math.cos(z);
    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;
    return out;
  }

  static fromEulerB(
    buffer: BufferLike,
    offset: number,
    x: number,
    y: number,
    z: number
  ) {
    const htr = Quaternion.HALF_TO_RAD;
    x *= htr;
    y *= htr;
    z *= htr;
    const sx = Math.sin(x);
    const cx = Math.cos(x);
    const sy = Math.sin(y);
    const cy = Math.cos(y);
    const sz = Math.sin(z);
    const cz = Math.cos(z);
    buffer[offset + 0] = sx * cy * cz - cx * sy * sz;
    buffer[offset + 1] = cx * sy * cz + sx * cy * sz;
    buffer[offset + 2] = cx * cy * sz - sx * sy * cz;
    buffer[offset + 3] = cx * cy * cz + sx * sy * sz;
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }
}

export function quat(
  x: number = 0,
  y: number = 0,
  z: number = 0,
  w: number = 1
): Quaternion {
  return new Quaternion(x, y, z, w);
}
