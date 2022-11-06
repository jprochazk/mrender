// TODO: low-level API
// Goal: Make it less painful to work with the WebGL API
// Non-goal: Turning this into a framework
// - Framework will be built *on top of* this
// - Wrapper classes for everything:
//   - ✔️ Context
//   - ✔️ Buffer
//   - ✔️ Attribute Arrays
//   - ✔️ Shader
//     - 🚧 Uniform Buffers
//   - 🚧 Texture
//     - 🚧 From Image/TypedArray
//     - 🚧 Sampler (?)
//   - 🚧 Framebuffer/Renderbuffer
//   - (?) TransformFeedback
//   - (?) Query
//   - (?) Sync
// TODO: context extensions
// TODO: handle context loss (can test with 'WEBGL_lose_context' extension)

export * from "./const";
export * from "./context";
export * from "./buffer";
export * from "./shader";
export * from "./attribute";
export * from "./attribArray";
