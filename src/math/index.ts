
export * from "./common";
export * from "./matrix2";
export * from "./matrix3";
export * from "./matrix4";
export * from "./quaternion";
export * from "./vector2";
export * from "./vector3";
export * from "./vector4";

// TODO swizzling?
/*
// This generates the body of a swizzle operator
const opIndexMap = {
    "x": 0,
    "y": 1,
    "z": 2,
    "w": 3,
};
function* ops(v) {
    for (const op of v.split("")) {
        if (op in opIndexMap) {
            yield opIndexMap[op];
        }
    }
}
function swizzle(v, d) {
    if (v.length > 1) {
        let out = "";
        out += `return new Vector${v.length}(`;
        let c = 0;
        for (const op of ops(v)) {
            if (op >= d) {
                out += `0.0`;
            } else {
                out += `this[${op}]`;
            }
            if (++c !== v.length) out += ",";
        }
        out += ");";
        return out;
    }
}
*/