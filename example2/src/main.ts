import { loop } from "uloop";
import { dedent, PRNG } from "../../src/common";
import { Target, Usage } from "../../src/gl";
import { mat4, Matrix4, quat, Quaternion, vec3, Vector3, Vector4, Context } from "../../src/index";

const hex = (t: TemplateStringsArray) => Vector4.fromHex(t[0]);

const ctx = new Context();
ctx.appendTo(document.getElementById("root")!);
//@ts-ignore
window.ctx = ctx;

const points: [number, number][] = [];
// Coordinates of the shape's points
const shape = [
  { x: ctx.width / 2, y: 0 },
  { x: ctx.width, y: ctx.height },
  { x: 0, y: ctx.height },
];
// Coordinates of a random point
const point = {
  x: Math.round(Math.random() * 500),
  y: Math.round(Math.random() * 500),
};
// How many points we've drawn so far
let count = 0;
let previousRand: number | null = null;
while (count < 15000) {
  // Pick a random number
  const currentRand = Math.floor(Math.random() * shape.length);

  // If it's different from the previous one we picked
  if ((previousRand! + 2) % 4 !== currentRand) {
    // Update the previousRand variable
    previousRand = currentRand;

    // Same as before
    const corner = shape[currentRand];
    point.x = (point.x + corner.x) / 2;
    point.y = (point.y + corner.y) / 2;
    points.push([point.x, point.y]);
    count++;
  }
}

ctx.background = Vector4.fromHex("0AAFA0FF");
const shader = ctx.createShader({
  vertex: dedent`
    #version 300 es
    precision mediump float;

    layout(location = 0) in vec2 Position;
    layout(location = 1) in vec2 UV;

    uniform mat4 Projection;
    uniform mat4 View;
    uniform mat4 Model;

    out vec2 v_UV;

    void main() {
      v_UV = UV;
      gl_Position = Projection * View * Model * vec4(Position, 0.0, 1.0);
    }`,
  fragment: dedent`
    #version 300 es
    precision mediump float;

    uniform sampler2D Texture;
    
    in vec2 v_UV;

    out vec4 color;

    void main() {
      color = texture(Texture, v_UV);
    }`,
});
shader.bind();

const positionBuffer = ctx.createBuffer(new Float32Array([-1, -1, -1, +1, +1, +1, +1, -1]), true);
const uvBuffer = ctx.createBuffer(
  new Float32Array([+0.0, +0.0, +0.0, +1.0, +1.0, +1.0, +1.0, +0.0]),
  true
);
const indexBuffer = ctx.createBuffer(
  new Int16Array([0, 1, 2, 2, 3, 0]),
  true,
  Usage.Static,
  Target.Index
);
const vao = ctx.createAttribArray().vec2(positionBuffer).vec2(uvBuffer).index(indexBuffer).build();
vao.bind();

const tex = ctx.createTexture({ path: "Okayeg.png" });
tex.bind(0);

const camera = {
  eye: vec3(0, 0, -1),
  center: vec3(),
  worldUp: Vector3.Y.clone(),
};
Matrix4.orthographicB(shader.uniforms.Projection, 0, 0, ctx.width, ctx.height, 0, -1, 1);
Matrix4.lookAtB(shader.uniforms.View, 0, camera.eye, camera.center, camera.worldUp);

const pos = vec3(ctx.width / 2, ctx.height / 2);
const scale = vec3(2, 2, 1);
const rot = quat();

loop(
  60,
  () => {},
  () => {
    ctx.resize();
    ctx.clear();
    for (const point of points) {
      pos[0] = point[0];
      pos[1] = point[1];
      Matrix4.translatedScaledRotatedB(shader.uniforms.Model, 0, pos, scale, rot);
      shader.update();
      ctx.drawIndexed(indexBuffer.length);
    }
  }
);

