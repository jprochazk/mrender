
import { loop } from "uloop";
import { WEBGL } from "../../src/gl";
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

void main()
{
    gl_Position = vec4(aPOSITION, 0.0, 1.0);
}`,
    fragment: `#version 300 es
precision mediump float;

uniform vec4 uCOLOR;
out vec4 oFragColor;

void main()
{
    oFragColor = uCOLOR;
}`
});
shader.bind();
const color = Vector4.fromHex("FFFFFFFF");
const dColor = vec4(0.00133, 0.0024, 0.00365, 1);
shader.uniforms.uCOLOR = color;

const buffer = ctx.createBuffer(new Float32Array([-0.5, -0.5, 0.5, -0.5, 0, 0.5]), true);
const vao = ctx.gl.createVertexArray()!;
ctx.gl.bindVertexArray(vao);
buffer.bind();
ctx.gl.vertexAttribPointer(0, 2, WEBGL.FLOAT, false, 2 * 4, 0);
ctx.gl.enableVertexAttribArray(0);

loop(30,
    () => {
        color.add(dColor);
        color.x += dColor.x;
        if (color.x > 1 || color.x < 0) { dColor.x *= -1; }
        color.y += dColor.y;
        if (color.y > 1 || color.y < 0) { dColor.y *= -1; }
        color.z += dColor.z;
        if (color.z > 1 || color.z < 0) { dColor.z *= -1; }
        shader.uploadUniforms();
    }, () => {
        ctx.resize();
        ctx.clear();
        ctx.gl.drawArrays(WEBGL.TRIANGLES, 0, 3);
    }
);