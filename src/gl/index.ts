
// TODO: low-level API
// Goal: Make it less painful to work with the WebGL API
// Non-goal: Turning this into a framework
// - Framework will be built *on top of* this
// - Wrapper classes for everything:
//   - Buffer
//   - Shader
//   - Texture
//   - Framebuffer
//   - etc...

export * from "./const";
export * from "./context";
export * from "./buffer";
export * from "./shader";
export * from "./attribute";
export * from "./attribArray";