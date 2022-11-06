import { clamp, EPSILON, fhypot, Randomizer } from "./common";
import { Matrix3 } from "./matrix3";
import { Matrix4 } from "./matrix4";
import { Quaternion } from "./quaternion";

export interface ReadonlyVector3 extends ReadonlyArray<number> {
  readonly x: number;
  readonly y: number;
  readonly z: number;

  clone(out?: Vector3): Vector3;
  /**
   * Creates a new vector using signs from components of `this`
   */
  sign(): Vector3;
  /**
   * Euclidean distance between `this` and `that`
   */
  dist(that: ReadonlyVector3): number;
  /**
   * Square of euclidean distance between `this` and `that`
   */
  dist2(that: ReadonlyVector3): number;
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
  dot(that: ReadonlyVector3): number;
  /**
   * Creates a new vector via the cross product of `this` and `that`
   */
  cross(that: ReadonlyVector3): Vector3;
  /**
   * Angle of `this` relative to `that`
   */
  angle(that: ReadonlyVector3): number;
  /**
   * Comparison between components of `this` and `that` with a margin of `epsilon`.
   *
   * If you need exact comparison, pass in `0` for `epsilon`.
   */
  equals(that: ReadonlyVector3, epsilon?: number): boolean;
}

/**
 * A 3-dimensional vector
 */
export class Vector3 extends Array<number> {
  static X: ReadonlyVector3 = new Vector3(1, 0, 0);
  static Y: ReadonlyVector3 = new Vector3(0, 1, 0);
  static Z: ReadonlyVector3 = new Vector3(0, 0, 1);

  constructor(x: number, y: number, z: number) {
    super(3);
    this[0] = x;
    this[1] = y;
    this[2] = z;
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

  clone(out = new Vector3(0, 0, 0)): Vector3 {
    out[0] = this[0];
    out[1] = this[1];
    out[2] = this[2];
    return out;
  }
  /**
   * Adds `that` to `this`
   */
  add(that: ReadonlyVector3): this {
    this[0] += that[0];
    this[1] += that[1];
    this[2] += that[2];
    return this;
  }
  /**
   * Subtracts `that` from `this`
   */
  sub(that: ReadonlyVector3): this {
    this[0] -= that[0];
    this[1] -= that[1];
    this[2] -= that[2];
    return this;
  }
  /**
   * Multiplies `this` by `that`
   */
  mult(that: ReadonlyVector3): this {
    this[0] *= that[0];
    this[1] *= that[1];
    this[2] *= that[2];
    return this;
  }
  /**
   * Divides `this` by `that`
   */
  div(that: ReadonlyVector3): this {
    this[0] /= that[0];
    this[1] /= that[1];
    this[2] /= that[2];
    return this;
  }
  /**
   * Component-wise minimum of `a` and `b`
   */
  static min(a: ReadonlyVector3, b: ReadonlyVector3): Vector3 {
    return new Vector3(
      Math.min(a[0], b[0]),
      Math.min(a[1], b[1]),
      Math.min(a[2], b[2])
    );
  }
  /**
   * Component-wise maximum of `a` and `b`
   */
  static max(a: ReadonlyVector3, b: ReadonlyVector3): Vector3 {
    return new Vector3(
      Math.max(a[0], b[0]),
      Math.max(a[1], b[1]),
      Math.max(a[2], b[2])
    );
  }
  /**
   * Creates a new vector using signs from components of `this`
   */
  sign(): Vector3 {
    return new Vector3(
      Math.sign(this[0]),
      Math.sign(this[1]),
      Math.sign(this[2])
    );
  }
  /**
   * Ceils components of `this`
   */
  ceil(): this {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    this[2] = Math.ceil(this[2]);
    return this;
  }
  /**
   * Floors components of `this`
   */
  floor(): this {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    this[2] = Math.floor(this[2]);
    return this;
  }
  /**
   * Rounds components of `this`
   */
  round(): this {
    this[0] = Math.round(this[0]);
    this[1] = Math.round(this[1]);
    this[2] = Math.round(this[2]);
    return this;
  }
  /**
   * Scales components of `this` by `value`
   */
  scale(value: number): this {
    this[0] *= value;
    this[1] *= value;
    this[2] *= value;
    return this;
  }
  /**
   * Euclidean distance between `this` and `that`
   */
  dist(that: ReadonlyVector3): number {
    return fhypot(that[0] - this[0], that[1] - this[1], that[2] - this[2]);
  }
  /**
   * Square of euclidean distance between `this` and `that`
   */
  dist2(that: ReadonlyVector3): number {
    const dx = that[0] - this[0];
    const dy = that[1] - this[1];
    const dz = that[2] - this[2];
    return dx * dx + dy * dy + dz * dz;
  }
  /**
   * Length of `this`
   */
  len(): number {
    return fhypot(this[0], this[1], this[2]);
  }
  /**
   * Squared length of `this`
   */
  len2(): number {
    return this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
  }
  /**
   * Component-wise clamp of `this` between `min` and `max`
   */
  clamp(min: ReadonlyVector3, max: ReadonlyVector3): Vector3 {
    return new Vector3(
      clamp(this[0], min[0], max[0]),
      clamp(this[1], min[1], max[1]),
      clamp(this[2], min[2], max[2])
    );
  }
  /**
   * Negates components of `this`
   */
  negate(): this {
    this[0] = -this[0];
    this[1] = -this[1];
    this[2] = -this[2];
    return this;
  }
  /**
   * Inverts components of `this`
   */
  invert(): this {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    this[2] = 1 / this[2];
    return this;
  }
  /**
   * Normalizes components of `this` to range (0, 1)
   */
  normalize(): this {
    let len = this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    this[0] *= len;
    this[1] *= len;
    this[2] *= len;
    return this;
  }
  /**
   * Dot product of `this` and `that`
   */
  dot(that: ReadonlyVector3): number {
    return this[0] * that[0] + this[1] * that[1] + this[2] * that[2];
  }
  /**
   * Creates a new vector via the cross product of `this` and `that`
   */
  cross(that: ReadonlyVector3): Vector3 {
    const ax = this[0],
      ay = this[1],
      az = this[2];
    const bx = that[0],
      by = that[1],
      bz = that[2];
    return new Vector3(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
  }
  /**
   * Creates a new vector by linearly interpolating between `a` and `b` with weight `t`
   */
  static lerp(a: ReadonlyVector3, b: ReadonlyVector3, t: number): Vector3 {
    return new Vector3(
      a[0] + t * (b[0] - a[0]),
      a[1] + t * (b[1] - a[1]),
      a[2] + t * (b[2] - a[2])
    );
  }
  /**
   * Transforms `this` using `mat`
   */
  transformM3(mat: Matrix3): this {
    this[0] = this[0] * mat[0] + this[1] * mat[3] + this[2] * mat[6];
    this[1] = this[0] * mat[1] + this[1] * mat[4] + this[2] * mat[7];
    this[2] = this[0] * mat[2] + this[1] * mat[5] + this[2] * mat[8];
    return this;
  }
  /**
   * Transforms `this` using `mat`
   */
  transformM4(mat: Matrix4): this {
    let w = mat[3] * this[0] + mat[7] * this[1] + mat[11] * this[2] + mat[15];
    if (w === 0.0) w = 1.0;
    this[0] =
      (mat[0] * this[0] + mat[4] * this[1] + mat[8] * this[2] + mat[12]) / w;
    this[1] =
      (mat[1] * this[0] + mat[5] * this[1] + mat[9] * this[2] + mat[13]) / w;
    this[2] =
      (mat[2] * this[0] + mat[6] * this[1] + mat[10] * this[2] + mat[14]) / w;
    return this;
  }
  /**
   * Transforms `this` using `quat`
   *
   * `quat` can also be a dual quaternion
   */
  transformQ(quat: Quaternion): this {
    const qx = quat[0],
      qy = quat[1],
      qz = quat[2],
      qw = quat[3];
    const x = this[0],
      y = this[1],
      z = this[2];
    const uvx = qy * z - qz * y,
      uvy = qz * x - qx * z,
      uvz = qx * y - qy * x;
    const uuvx = qy * uvz - qz * uvy,
      uuvy = qz * uvx - qx * uvz,
      uuvz = qx * uvy - qy * uvx;
    const w2 = qw * 2;
    this[0] = x + uvx * w2 + uuvx * 2;
    this[1] = y + uvy * w2 + uuvy * 2;
    this[2] = z + uvz * w2 + uuvz * 2;
    return this;
  }
  /**
   * Rotates `this` around `origin` by `angle` on the X axis
   *
   * `angle` must be in radians
   */
  rotateX(origin: ReadonlyVector3, angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const px = this[0] - origin[0];
    const py = this[1] - origin[1];
    const pz = this[2] - origin[2];
    const rx = px;
    const ry = py * c - pz * s;
    const rz = py * s + pz * c;
    this[0] = rx + origin[0];
    this[1] = ry + origin[1];
    this[2] = rz + origin[2];
    return this;
  }
  /**
   * Rotates `this` around `origin` by `angle` on the Y axis
   *
   * `angle` must be in radians
   */
  rotateY(origin: ReadonlyVector3, angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const px = this[0] - origin[0];
    const py = this[1] - origin[1];
    const pz = this[2] - origin[2];
    const rx = pz * s + px * c;
    const ry = py;
    const rz = pz * c - px * s;
    this[0] = rx + origin[0];
    this[1] = ry + origin[1];
    this[2] = rz + origin[2];
    return this;
  }
  /**
   * Rotates `this` around `origin` by `angle` on the Z axis
   *
   * `angle` must be in radians
   */
  rotateZ(origin: ReadonlyVector3, angle: number): this {
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const px = this[0] - origin[0];
    const py = this[1] - origin[1];
    const pz = this[2] - origin[2];
    const rx = px * c - py * s;
    const ry = px * s + py * c;
    const rz = pz;
    this[0] = rx + origin[0];
    this[1] = ry + origin[1];
    this[2] = rz + origin[2];
    return this;
  }

  /**
   * Angle of `this` relative to `that`
   */
  angle(that: ReadonlyVector3): number {
    const lenA = this[0] * this[0] + this[1] * this[1] + this[2] * this[2];
    const lenB = that[0] * that[0] + that[1] * that[1] + that[2] * that[2];
    const dotAB = this[0] * that[0] + this[1] * that[1] + this[2] * that[2];
    const mag = Math.sqrt(lenA) * Math.sqrt(lenB);
    let cosine = 0.0;
    if (mag !== 0.0) {
      cosine = dotAB / mag;
    }
    return Math.acos(clamp(cosine, -1, 1));
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
  static random(rand: Randomizer = Math.random): Vector3 {
    const angle = rand() * 2.0 * Math.PI;
    const z = rand() * 2.0 - 1.0;
    const d = Math.sqrt(1.0 - z * z);
    return new Vector3(Math.cos(angle) * d, Math.sin(angle) * d, z);
  }
  /**
   * Comparison between components of `this` and `that` with a margin of `epsilon`.
   *
   * If you need exact comparison, pass in `0` for `epsilon`.
   */
  equals(that: ReadonlyVector3, epsilon: number = EPSILON): boolean {
    return (
      Math.abs(this[0] - that[0]) <= epsilon &&
      Math.abs(this[1] - that[1]) <= epsilon &&
      Math.abs(this[2] - that[2]) <= epsilon
    );
  }

  toString(): string {
    return `(${this.map((v) => v.toFixed(2)).join(", ")})`;
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }
}

export function vec3(x = 0.0, y = 0.0, z = 0.0): Vector3 {
  return new Vector3(x, y, z);
}
