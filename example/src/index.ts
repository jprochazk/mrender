
import { loop } from "uloop";
import { dedent } from "../../src/common";
import { Usage } from "../../src/gl";
import { GL, Matrix4, quat, Quaternion, vec3, Vector3, Vector4 } from "../../src/index";

const hex = (t: TemplateStringsArray) => Vector4.fromHex(t[0]);

const ctx = new GL.Context();
ctx.appendTo(document.getElementById("root")!);
//@ts-ignore
window.ctx = ctx;

ctx.background = Vector4.fromHex("0AAFA0FF");
const shader = ctx.createShader({
    vertex: dedent`
    #version 300 es
    precision mediump float;
    layout(location = 0) in vec3 position;
    layout(location = 1) in vec4 color;
    layout(location = 2) in mat4 model;
    uniform mat4 projection;
    uniform mat4 view;
    out vec4 vcolor;
    void main() {
        vcolor = color;
        gl_Position = projection * view * model * vec4(position, 1.0);
    }`,
    fragment: dedent`
    #version 300 es
    precision mediump float;
    in vec4 vcolor;
    out vec4 color;
    void main() {
        color = vcolor;
    }`
});
shader.bind();

const instances = 20;

const positionBuffer = ctx.createBuffer(new Float32Array([
    /* -0.5, -0.5, 0.0,
    +0.5, -0.5, 0.0,
    +0.5, +0.5, 0.0,
    -0.5, +0.5, 0.0, */
    -0.2, 1.0, 0.0,
    -0.2, -1.0, 0.0,
    0.2, -1.0, 0.0,
    0.2, -1.0, 0.0,
    -0.2, 1.0, 0.0,
    0.2, 1.0, 0.0,
    1.0, -0.2, 0.0,
    -1.0, -0.2, 0.0,
    -1.0, 0.2, 0.0,
    -1.0, 0.2, 0.0,
    1.0, -0.2, 0.0,
    1.0, 0.2, 0.0,
]), true);
const matrixBuffer = ctx.createBuffer(new Float32Array(16 * instances), false, Usage.Dynamic);
const colors = [
    hex`FFFFFFFF`,
    hex`00FF00FF`,
    hex`0000FFFF`,
    hex`FFFF00FF`,
    hex`00FFFFFF`,
];
const colorBuffer = ctx.createBuffer(new Float32Array(
    Array(4 * instances).fill(0).map((_, i) => colors[i % colors.length]).flat(Infinity) as number[]
), true)
const vao = ctx.createAttribArray()
    .vec3(positionBuffer)
    .vec4(colorBuffer, 1)
    .mat4(matrixBuffer, 1)
    .build();
vao.bind();

let time = 0;

loop(60,
    () => {
        time += 0.025;
    },
    () => {
        ctx.resize();
        ctx.clear();
        shader.uniforms.projection = Matrix4.orthographic(0, ctx.width, ctx.height, 0, -1, 1);
        shader.uniforms.view = Matrix4.lookAt(vec3(0, 0, -1), vec3(), Vector3.Y);

        for (let i = 0; i < instances; ++i) {
            const matrix = Matrix4.translatedScaledRotated(
                vec3(50 * i + (ctx.width / 2 - (50 * instances / 2)), ctx.height / 2, 0),
                vec3(100, 100, 1),
                Quaternion.fromEuler(0, 0, time + time * i)
            );
            for (let j = 0; j < matrix.length; ++j) {
                matrixBuffer.inner[i * 16 + j] = matrix[j];
            }
        }
        matrixBuffer.upload();
        ctx.drawInstanced(instances, positionBuffer.length / 3);
    }
);