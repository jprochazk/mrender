
import { loop } from "uloop";
import { Attribute, AttributeArray, BufferTarget, WEBGL } from "../../src/gl";
import { GL, mat4, vec4, Vector4 } from "../../src/index";

const ctx = new GL.Context();
ctx.appendTo(document.getElementById("root")!);
//@ts-ignore
window.ctx = ctx;

ctx.background = Vector4.fromHex("0AAFA0FF");
const shader = ctx.createShader({
    vertex: `#version 300 es
precision mediump float;

layout(location = 0) in vec2 aPOSITION;
layout(location = 1) in vec4 aCOLOR;

out vec4 vCOLOR;

void main()
{
    vCOLOR = aCOLOR;
    gl_Position = vec4(aPOSITION, 0.0, 1.0);
}`,
    fragment: `#version 300 es
precision mediump float;

uniform float uTIME;
in vec4 vCOLOR;
out vec4 oFragColor;

void main()
{
    oFragColor = vCOLOR * uTIME;
}`
});
shader.bind();
shader.uniforms.uTIME = 0;
const positionBuffer = ctx.createBuffer(new Float32Array([
    -0.5, -0.5,
    +0.5, -0.5,
    +0.5, +0.5,
    -0.5, +0.5,
]), true);
const colorBuffer = ctx.createBuffer(new Float32Array([
    ...Vector4.fromHex("FF0000FF"),
    ...Vector4.fromHex("00FF00FF"),
    ...Vector4.fromHex("0000FFFF"),
    ...Vector4.fromHex("FFFFFFFF"),
]), true);
const indexBuffer = ctx.createBuffer(new Uint16Array([
    0, 1, 2, 2, 3, 0
]), true, BufferTarget.Index);
const vao = ctx.createAttribArray()
    .vec2(positionBuffer)
    .vec4(colorBuffer)
    .index(indexBuffer)
    .build();
vao.bind();

let delta = 0.005;
loop(30,
    () => {
    }, () => {
        ctx.resize();
        ctx.clear();
        const time = shader.uniforms.uTIME;
        if (time > 1 || time < 0) delta *= -1;
        shader.uniforms.uTIME += delta;
        ctx.gl.drawElements(WEBGL.TRIANGLES, 6, WEBGL.UNSIGNED_SHORT, 0);
    }
);