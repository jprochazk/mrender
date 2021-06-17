
export type Constructor<T> = {
    new(...args: any[]): T;
}

/**
 * Creates an error with the stack trimmed up to a specific depth (default 1)
 */
export function deepError(message: string, depth = 1) {
    const error = new Error(message);
    if (error.stack === undefined) {
        return error;
    }
    const lines = error.stack!.split("\n");
    lines.splice(1, depth + 1);
    error.stack = lines.join("\n");
    return error;
}

export function UseAfterFree(): any {
    throw deepError("Attempted to use freed resource");
}

export function flatten(data: any, depth = 1, out: any[] = []): any[] {
    if (depth <= -1 || !Array.isArray(data)) {
        out.push(data);
        return out;
    }
    for (let i = 0; i < data.length; ++i) {
        flatten(data[i], depth - 1, out);
    }
    return out;
}

/**
 * Free-able resource
 */
export interface Resource {
    free(): void;
}

export function enumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = true;
}