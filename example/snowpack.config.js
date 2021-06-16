// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    src: { url: "/" },
  },
  plugins: [
    "@snowpack/plugin-typescript"
  ],
  optimize: {
    bundle: true,
    minify: true,
    treeshake: true,
    target: "es2020"
  },
  alias: {
    /* ... */
  },
  packageOptions: {
    /* ... */
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  workspaceRoot: ".."
};
