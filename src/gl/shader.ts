import { Context } from "./context";

export interface ShaderSource {
    vertex: string,
    fragment: string,
}

export class Shader {
    private program: WebGLProgram;
    constructor(
        private gl: WebGL2RenderingContext,
        public source: ShaderSource
    ) {
        this.program = linkProgram(this.gl,
            compileShader(this.gl, source.vertex, this.gl.VERTEX_SHADER),
            compileShader(this.gl, source.fragment, this.gl.FRAGMENT_SHADER)
        );
    }

    bind() {
        this.gl.useProgram(this.program);
    }

    unbind() {
        this.gl.useProgram(null);
    }
}

function linkProgram(gl: WebGL2RenderingContext, vertex: WebGLShader, fragment: WebGLShader): WebGLProgram {
    const program = gl.createProgram();
    if (!program) throw new Error(`Failed to create program`);

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS) === false) {
        const log = gl.getProgramInfoLog(program);
        throw new Error(("\n" + log) ?? "Unknown error");
    }
    return program;
}

function compileShader(gl: WebGL2RenderingContext, source: string, type: GLenum): WebGLShader {
    const shader = gl.createShader(type);
    if (!shader) throw new Error(`Failed to create shader`);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
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