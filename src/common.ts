
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

/**
 * Mark a class property as enumerable
 */
export function enumerable(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = true;
}

export type TemplateValue = { toString(): string };
export function dedent(strings: TemplateStringsArray, ...exprs: TemplateValue[]): string {
    // append all the strings and exprs into an array,
    // in an alternating pattern (string -> expr -> string -> expr -> ...)
    const out = Array(strings.length + exprs.length);
    let tsaCursor = 0;
    let exprCursor = 0;
    let putString = true;
    for (let i = 0; i < out.length; ++i) {
        if (putString) out[i] = strings[tsaCursor++];
        else out[i] = exprs[exprCursor++].toString();
        putString = !putString;
    }

    // now join the fragments, split them by '\n',
    // and look for the shortest indentation at the start of any line
    let lines = out.join("").split("\n");
    // skip the first line if it is empty
    lines = lines.slice(lines[0]?.length === 0 ? 1 : 0);
    let shortest = Infinity;
    for (let i = 0; i < lines.length; ++i) {
        const line = lines[i];
        // skip empty lines
        if (line.length === 0) continue;

        let indent = 0;
        for (let j = 0; j < line.length; ++j) {
            if (line.charCodeAt(j) === 32 /* space */) indent += 1;
            else break;
        }
        if (indent < shortest) shortest = indent;
    }
    if (shortest === Infinity) shortest = 0;

    // finally, trim `shortest` from the start of every line,
    // join the lines with '\n' and return the result
    for (let i = 0; i < lines.length; ++i) {
        lines[i] = lines[i].slice(shortest);
    }

    return lines.join("\n");
}