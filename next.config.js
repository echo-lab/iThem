const removeImports = require("next-remove-imports")();
module.exports = removeImports({
  experimental: { esmExternals: true },
  reactStrictMode: true,
  swcMinify: false,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    config.resolve.fallback = { vm: false };

    return config;
  },
});
