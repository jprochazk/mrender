
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

const instances = 50;

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

const camera = {
    eye: vec3(0, 0, -1),
    center: vec3(),
    worldUp: Vector3.Y.clone()
};

const pos = vec3();
const scale = vec3(10, 10, 1);
const rot = quat();

loop(60,
    () => { },
    () => {
        time += 0.005;
        ctx.resize();
        ctx.clear();
        Matrix4.orthographicB(shader.uniforms.projection, 0, 0, ctx.width, ctx.height, 0, -1, 1);
        Matrix4.lookAtB(shader.uniforms.view, 0, camera.eye, camera.center, camera.worldUp);
        shader.update();

        for (let i = 0; i < instances; ++i) {
            pos[0] = 10 * i + (ctx.width / 2 - (10 * instances / 2));
            pos[1] = ctx.height / 2;
            pos[2] = 0;
            Quaternion.fromEulerB(rot, 0, 0, 0, time + time * i);
            Matrix4.translatedScaledRotatedB(matrixBuffer.inner, i * 16, pos, scale, rot);
        }
        matrixBuffer.upload();
        ctx.drawInstanced(instances, positionBuffer.length / 3);
    }
);