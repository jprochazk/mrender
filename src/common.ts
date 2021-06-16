
export type Constructor<T> = {
    new(...args: any[]): T;
}

export function deepError(depth: number, message: string) {
    const error = new Error(message);
    if (error.stack === undefined) {
        return error;
    }
    const lines = error.stack!.split("\n");
    lines.splice(1, depth + 1);
    error.stack = lines.join("\n");
    return error;
}

// TODO: @DEBUG only do this in debug mode (?)
const InvalidUsage = function () {
    throw deepError(1, "Attempted to use a resource after .free()");
}
const InvalidUsageDescriptor = { get: InvalidUsage, set: InvalidUsage };
const DescriptorCache = {} as Record<any, any>;
function invalidate(obj: any) {
    const tag = Object.getPrototypeOf(obj);
    let descriptor = DescriptorCache[tag];
    if (!descriptor) {
        descriptor = {} as Record<string, any>;
        for (const key in obj) {
            descriptor[key] = InvalidUsageDescriptor;
        }
        DescriptorCache[tag] = descriptor;
    }
    Object.defineProperties(obj, descriptor);
}

/**
 * Marks a resource as `freeable`. The overriden `free` method
 * should *always* call `super.free()`. All methods on the child
 * class should be marked with `@enumerable`.
 */
export abstract class Resource {
    free(): void {
        invalidate(this);
    }
}

export function enumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = true;
}