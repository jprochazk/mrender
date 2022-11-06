import { clamp, EPSILON, fhypot, Randomizer } from "./common";
import { Matrix3 } from "./matrix3";
import { Matrix4 } from "./matrix4";
import { Vector3 } from "./vector3";

export interface ReadonlyVector2 extends ReadonlyArray<number> {
  readonly x: number;
  readonly y: number;

  clone(out?: Vector2): Vector2;
  /**
   * Creates a new vector using signs from components of `this`
   */
  sign(): ReadonlyVector2;
  /**
   * Euclidean distance between `this` and `that`
   */
  dist(that: ReadonlyVector2): number;
  /**
   * Square of euclidean distance between `this` and `that`
   */
  dist2(that: ReadonlyVector2): number;
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
  dot(that: ReadonlyVector2): number;
  /**
   * Cross product of `this` and `that`
   */
  cross(that: ReadonlyVector2): Vector3;
  /**
   * Angle of `this` relative to `that`
   */
  angle(that: ReadonlyVector2): number;
  /**
   * Comparison between components of `this` and `that` with a margin of `epsilon`.
   *
   * If you need exact comparison, pass in `0` for `epsilon`.
   */
  equals(that: ReadonlyVector2, epsilon?: number): boolean;
}

/**
 * A 2-dimensional vector
 */
export class Vector2 extends Array<number> {
  static X: ReadonlyVector2 = new Vector2(1, 0);
  static Y: ReadonlyVector2 = new Vector2(0, 1);

  constructor(x: number, y: number) {
    super(2);
    this[0] = x;
    this[1] = y;
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

  clone(out = new Vector2(0, 0)): Vector2 {
    out[0] = this[0];
    out[1] = this[1];
    return out;
  }
  /**
   * Adds `that` to `this`
   */
  add(that: ReadonlyVector2): this {
    this[0] += that[0];
    this[1] += that[1];
    return this;
  }
  /**
   * Subtracts `that` from `this`
   */
  sub(that: ReadonlyVector2): this {
    this[0] -= that[0];
    this[1] -= that[1];
    return this;
  }
  /**
   * Multiplies `this` by `that`
   */
  mult(that: ReadonlyVector2): this {
    this[0] *= that[0];
    this[1] *= that[1];
    return this;
  }
  /**
   * Divides `this` by `that`
   */
  div(that: ReadonlyVector2): this {
    this[0] /= that[0];
    this[1] /= that[1];
    return this;
  }
  /**
   * Component-wise minimum of `a` and `b`
   */
  static min(a: ReadonlyVector2, b: ReadonlyVector2): Vector2 {
    return new Vector2(Math.min(a[0], b[0]), Math.min(a[1], b[1]));
  }
  /**
   * Component-wise maximum of `a` and `b`
   */
  static max(a: ReadonlyVector2, b: ReadonlyVector2): Vector2 {
    return new Vector2(Math.max(a[0], b[0]), Math.max(a[1], b[1]));
  }
  /**
   * Creates a new vector using signs from components of `this`
   */
  sign(): Vector2 {
    return new Vector2(Math.sign(this[0]), Math.sign(this[1]));
  }
  /**
   * Ceils components of `this`
   */
  ceil(): this {
    this[0] = Math.ceil(this[0]);
    this[1] = Math.ceil(this[1]);
    return this;
  }
  /**
   * Floors components of `this`
   */
  floor(): this {
    this[0] = Math.floor(this[0]);
    this[1] = Math.floor(this[1]);
    return this;
  }
  /**
   * Rounds components of `this`
   */
  round(): this {
    this[0] = Math.round(this[0]);
    this[1] = Math.round(this[1]);
    return this;
  }
  /**
   * Scales components of `this` by `value`
   */
  scale(value: number): this {
    this[0] *= value;
    this[1] *= value;
    return this;
  }
  /**
   * Euclidean distance between `this` and `that`
   */
  dist(that: ReadonlyVector2): number {
    return fhypot(that[0] - this[0], that[1] - this[1]);
  }
  /**
   * Square of euclidean distance between `this` and `that`
   */
  dist2(that: ReadonlyVector2): number {
    const dx = that[0] - this[0];
    const dy = that[1] - this[1];
    return dx * dx + dy * dy;
  }
  /**
   * Length of `this`
   */
  len(): number {
    return fhypot(this[0], this[1]);
  }
  /**
   * Squared length of `this`
   */
  len2(): number {
    return this[0] * this[0] + this[1] * this[1];
  }
  /**
   * Component-wise clamp of `this` between `min` and `max`
   */
  clamp(min: ReadonlyVector2, max: ReadonlyVector2): Vector2 {
    return new Vector2(
      clamp(this[0], min[0], max[0]),
      clamp(this[1], min[1], max[1])
    );
  }
  /**
   * Negates components of `this`
   */
  negate(): this {
    this[0] = -this[0];
    this[1] = -this[1];
    return this;
  }
  /**
   * Inverts components of `this`
   */
  invert(): this {
    this[0] = 1 / this[0];
    this[1] = 1 / this[1];
    return this;
  }
  /**
   * Normalizes components of `this` to range (0, 1)
   */
  normalize(): this {
    let len = this[0] * this[0] + this[1] * this[1];
    if (len > 0) {
      len = 1 / Math.sqrt(len);
    }
    this[0] *= len;
    this[1] *= len;
    return this;
  }
  /**
   * Dot product of `this` and `that`
   */
  dot(that: ReadonlyVector2): number {
    return this[0] * that[0] + this[1] * that[1];
  }
  /**
   * Cross product of `this` and `that`
   */
  cross(that: ReadonlyVector2): Vector3 {
    const z = this[0] * that[1] - this[1] * that[0];
    return new Vector3(0, 0, z);
  }
  /**
   * Creates a new vector by linearly interpolating between `a` and `b` with weight `t`
   */
  static lerp(a: ReadonlyVector2, b: ReadonlyVector2, t: number): Vector2 {
    return new Vector2(a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1]));
  }
  /**
   * Transforms `this` using `mat`
   */
  /* transformM2(mat: Matrix2): this {
        this[0] = mat[0] * this[0] + mat[2] * this[1];
        this[1] = mat[1] * this[0] + mat[3] * this[1];
        return this;
    } */
  /**
   * Transforms `this` using `mat`
   */
  transformM3(mat: Matrix3): this {
    this[0] = mat[0] * this[0] + mat[3] * this[1] + mat[6];
    this[0] = mat[1] * this[0] + mat[4] * this[1] + mat[7];
    return this;
  }
  /**
   * Transforms `this` using `mat`
   */
  transformM4(mat: Matrix4): this {
    this[0] = mat[0] * this[0] + mat[4] * this[1] + mat[12];
    this[1] = mat[1] * this[0] + mat[5] * this[1] + mat[13];
    return this;
  }
  /**
   * Rotates `this` around `origin` by `angle`
   *
   * `angle` must be in radians
   */
  rotate(origin: ReadonlyVector2, angle: number): this {
    const p0 = this[0] - origin[0],
      p1 = this[1] - origin[1],
      sinC = Math.sin(angle),
      cosC = Math.cos(angle);
    this[0] = p0 * cosC - p1 * sinC + origin[0];
    this[1] = p0 * sinC + p1 * cosC + origin[1];
    return this;
  }
  /**
   * Angle of `this` relative to `that`
   */
  angle(that: ReadonlyVector2): number {
    const lenA = this[0] * this[0] + this[1] * this[1];
    const lenB = that[0] * that[0] + that[1] * that[1];
    const dotAB = this[0] * that[0] + this[1] * that[1];
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
    return this;
  }
  /**
   * Generates a random normalized vector.
   *
   * `randomizer.random()` should return a value between 0 and 1.
   */
  static random(rand: Randomizer = Math.random): Vector2 {
    const angle = rand() * 2.0 * Math.PI;
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }
  /**
   * Comparison between components of `this` and `that` with a margin of `epsilon`.
   *
   * If you need exact comparison, pass in `0` for `epsilon`.
   */
  equals(that: ReadonlyVector2, epsilon: number = EPSILON): boolean {
    return (
      Math.abs(this[0] - that[0]) <= epsilon &&
      Math.abs(this[1] - that[1]) <= epsilon
    );
  }

  toString(): string {
    return `(${this.map((v) => v.toFixed(2)).join(", ")})`;
  }

  get [Symbol.toStringTag](): string {
    return this.constructor.name;
  }
}

export function vec2(x = 0, y = 0): Vector2 {
  return new Vector2(x, y);
}
