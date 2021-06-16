import { enumerable, Resource } from "../common";
import { WEBGL } from "./const";

export interface ShaderSource {
    vertex: string,
    fragment: string,
}

export class Shader extends Resource {
    private program: WebGLProgram;
    public readonly info: Readonly<Record<string, UniformInfo>>;

    public uniforms: Record<string, number | number[]>;
    private uniformData: Record<string, number | number[]>;
    private uniformKeys: string[];

    constructor(
        private gl: WebGL2RenderingContext,
        public source: ShaderSource
    ) {
        super();
        this.program = compile(this.gl, source);
        this.info = reflectUniforms(this.gl, this.program);

        this.uniforms = {};
        this.uniformData = {};
        this.uniformKeys = Object.keys(this.info);
        for (const name of this.uniformKeys) {
            Object.defineProperty(this.uniforms, name, {
                get: () => { this.uniformData[name]; },
                set: (value) => { this.uniformData[name] = value; }
            });
        }
    }

    /**
     * Uploads uniform data to the GPU
     */
    @enumerable
    uploadUniforms() {
        for (let i = 0, len = this.uniformKeys.length; i < len; ++i) {
            const key = this.uniformKeys[i];
            console.log(this.info[key].setter);
            console.log(this.uniformData[key]);
            this.info[key].setter(this.uniformData[key])
        }
    }

    @enumerable
    bind() {
        this.gl.useProgram(this.program);
    }

    @enumerable
    unbind() {
        this.gl.useProgram(null);
    }

    @enumerable
    free() {
        this.gl.deleteProgram(this.program);
        super.free();
    }
}

function createUniformSetter(
    gl: WebGL2RenderingContext,
    type: number,
    location: WebGLUniformLocation
): (data: number | number[]) => void {
    let desc: "scalar" | "array" | "matrix";
    let size: number;
    let name: string;
    switch (type) {
        case 0x1400:
        case 0x1402:
        case 0x1404:
        case 0x8b56:
        case 0x8b5e:
        case 0x8b5f:
        case 0x8b60:
        case 0x8dc1:
        case 0x8dd2:
            desc = "scalar"; size = 1; name = "uniform1i"; break;
        case 0x1401:
        case 0x1403:
        case 0x1405:
            desc = "scalar"; size = 1; name = "uniform1ui"; break;
        case 0x8b53:
        case 0x8b57:
            desc = "array"; size = 2; name = "uniform2iv"; break;
        case 0x8b54:
        case 0x8b58:
            desc = "array"; size = 3; name = "uniform3iv"; break;
        case 0x8b55:
        case 0x8b59:
            desc = "array"; size = 4; name = "uniform4iv"; break;
        case 0x1406:
            desc = "scalar"; size = 1; name = "uniform1f"; break;
        case 0x8b50:
            desc = "array"; size = 2; name = "uniform2fv"; break;
        case 0x8b51:
            desc = "array"; size = 3; name = "uniform3fv"; break;
        case 0x8b52:
            desc = "array"; size = 4; name = "uniform4fv"; break;
        case 0x8dc6:
            desc = "array"; size = 2; name = "uniform2uiv"; break;
        case 0x8dc7:
            desc = "array"; size = 3; name = "uniform3uiv"; break;
        case 0x8dc8:
            desc = "array"; size = 4; name = "uniform4uiv"; break;
        case 0x8b5a:
            desc = "matrix"; size = 2 * 2; name = "uniformMatrix2fv"; break;
        case 0x8b65:
            desc = "matrix"; size = 2 * 3; name = "uniformMatrix2x3fv"; break;
        case 0x8b66:
            desc = "matrix"; size = 2 * 4; name = "uniformMatrix2x4fv"; break;
        case 0x8b67:
            desc = "matrix"; size = 3 * 2; name = "uniformMatrix3x2fv"; break;
        case 0x8b5b:
            desc = "matrix"; size = 3 * 3; name = "uniformMatrix3fv"; break;
        case 0x8b68:
            desc = "matrix"; size = 3 * 4; name = "uniformMatrix3x4fv"; break;
        case 0x8b69:
            desc = "matrix"; size = 4 * 2; name = "uniformMatrix4x2fv"; break;
        case 0x8b6a:
            desc = "matrix"; size = 4 * 3; name = "uniformMatrix4x3fv"; break;
        case 0x8b5c:
            desc = "matrix"; size = 4 * 4; name = "uniformMatrix4fv"; break;
        default: throw new Error(`Unknown uniform type '${type}'`);
    }
    void (size);

    // TODO: @DEBUG check data sizes
    const setter = (gl[name as keyof WebGL2RenderingContext] as any).bind(gl);
    switch (desc) {
        case "scalar": return function (data) {
            setter(location, data);
        }
        case "array": return function (data) {
            setter(location, data);
        }
        case "matrix": return function (data) {
            setter(location, false, data);
        }
    }
}

export namespace Uniform {
    export function typeName(type: number): string {
        switch (type) {
            case 0x1400: return "byte";
            case 0x1402: return "short";
            case 0x1404: return "int";
            case 0x8b56: return "bool";
            case 0x8b5e: return "2d float sampler";
            case 0x8b5f: return "3d float sampler";
            case 0x8dc1: return "2d float sampler array";
            case 0x8dd2: return "2d unsigned int sampler";
            case 0x8b60: return "cube sampler";
            case 0x1401: return "unsigned byte";
            case 0x1403: return "unsigned short";
            case 0x1405: return "unsigned int";
            case 0x8b53: return "int 2-component vector";
            case 0x8b54: return "int 3-component vector";
            case 0x8b55: return "int 4-component vector";
            case 0x8b57: return "bool 2-component vector";
            case 0x8b58: return "bool 3-component vector";
            case 0x8b59: return "bool 4-component vector";
            case 0x1406: return "float";
            case 0x8b50: return "float 2-component vector";
            case 0x8b51: return "float 3-component vector";
            case 0x8b52: return "float 4-component vector";
            case 0x8dc6: return "unsigned int 2-component vector";
            case 0x8dc7: return "unsigned int 3-component vector";
            case 0x8dc8: return "unsigned int 4-component vector";
            case 0x8b5a: return "float 2x2 matrix";
            case 0x8b65: return "float 2x3 matrix";
            case 0x8b66: return "float 2x4 matrix";
            case 0x8b5b: return "float 3x3 matrix";
            case 0x8b67: return "float 3x2 matrix";
            case 0x8b68: return "float 3x4 matrix";
            case 0x8b5c: return "float 4x4 matrix";
            case 0x8b69: return "float 4x2 matrix";
            case 0x8b6a: return "float 4x3 matrix";
            default: return "unknown"
        }
    }
}

type UniformInfo = WebGLActiveInfo & {
    location: WebGLUniformLocation,
    setter(data: number | number[]): void
};

function reflectUniforms(
    gl: WebGL2RenderingContext,
    program: WebGLProgram
): Record<string, UniformInfo> {
    const out = {} as Record<string, UniformInfo>;
    const length = gl.getProgramParameter(program, WEBGL.ACTIVE_UNIFORMS);
    for (let i = 0; i < length; ++i) {
        const info = gl.getActiveUniform(program, i) as UniformInfo;
        info.location = gl.getUniformLocation(program, info.name)!;
        info.setter = createUniformSetter(gl, info.type, info.location);
        out[info.name] = info;
    }
    return out;
}

function compile(gl: WebGL2RenderingContext, source: ShaderSource): WebGLProgram {
    const vertex = compileOne(gl, source.vertex, WEBGL.VERTEX_SHADER);
    const fragment = compileOne(gl, source.fragment, WEBGL.FRAGMENT_SHADER);
    const program = link(gl, vertex, fragment);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    return program;
}

function link(gl: WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (!program) throw new Error(`Failed to create program`);

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, WEBGL.LINK_STATUS) === false) {
        const log = gl.getProgramInfoLog(program);
        throw new Error(("\n" + log) ?? "Unknown error");
    }
    return program;
}

function compileOne(gl: WebGL2RenderingContext, source: string, type: GLenum): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`Failed to create shader`);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, WEBGL.COMPILE_STATUS) === false) {
        throw new Error(buildShaderErrorMessage(gl, shader));
    }
    return shader;
}

function buildShaderErrorMessage(gl: WebGL2RenderingContext, shader: WebGLShader): string {
    const source = gl.getShaderSource(shader);
    const log = gl.getShaderInfoLog(shader);
    // if both sources are null, exit early
    if (source === null) {
        return `\n${log}\n`;
    }
    if (log === null) {
        return `Unknown error`;
    }
    // parse for line number and error
    const tokens = log
        .split("\n")
        .filter(it => it.length > 1)
        .map(it => it.replace(/(ERROR:\s)/g, ""))
        .map(it => it.split(":")).flat()
        .map(it => it.trim());
    const [line, token, error] = [parseInt(tokens[1]), tokens[2], tokens[3]];
    const lines = source.split(/\n|\r/g);

    const padding = `${lines.length}`.length;

    for (let i = 0; i < lines.length; ++i) {
        if (i === line - 1) {
            const whitespaces = lines[i].match(/\s+/);
            if (whitespaces !== null) {
                lines[i] = `${" ".repeat(padding - `${i + 1}`.length)}${i + 1} ${"-".repeat(whitespaces[0].length - 1)}> ${lines[i].trimStart()}`
            } else {
                lines[i] = `${" ".repeat(padding - `${i + 1}`.length)}${i + 1} +${lines[i]}`;
            }
        } else {
            lines[i] = `${" ".repeat(padding - `${i + 1}`.length)}${i + 1} | ${lines[i]}`;
        }
    }
    lines.push(`${" ".repeat(padding)} |`);
    lines.push(`${" ".repeat(padding)} +-------> ${error}: ${token}`);
    lines.push(``);

    return "\n" + lines.join("\n");
}