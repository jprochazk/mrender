
// TODO: every `static` method should also have a variant that works on an buffer + offset

export const EPSILON = 0.000001;
export const RAD = Math.PI / 180;
export function rad(angle: number) { return angle * RAD }
export const DEG = 180 / Math.PI;
export function deg(angle: number) { return angle * DEG }
export function clamp(num: number, min: number, max: number) {
    if (num <= min) return min
    if (num >= max) return max
    return num
}
export function lerp(start: number, end: number, weight: number) {
    return start * (1 - weight) + end * weight;
}
export function norm(start: number, end: number, value: number) {
    return (value - start) / (end - start);
}
export function fhypot(...n: number[]) {
    let sum = 0;
    for (let i = 0; i < n.length; ++i) {
        sum += n[i] * n[i];
    }
    return Math.sqrt(sum);
}
/**
 * Brings `n` up to the nearest power of 2.
 */
export function ceil2(n: number) {
    return Math.pow(2, Math.ceil(Math.log(n) / Math.log(2)));
}

export type Randomizer = () => number;

export type BufferLike = { [index: number]: number };