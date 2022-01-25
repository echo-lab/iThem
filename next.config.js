const removeImports = require("next-remove-imports")();
module.exports = removeImports({
  experimental: { esmExternals: true },
  reactStrictMode: true,
  "swcMinify": false
});