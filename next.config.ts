import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',

  // Set base path for GitHub Pages (repository name)
  basePath: '/Nova.ai',

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Transpile wllama package
  transpilePackages: ['@wllama/wllama'],

  // Empty turbopack config to silence warning and use webpack
  turbopack: {},

  // Configure webpack to handle wllama module and WebAssembly
  webpack: (config, { isServer }) => {
    // Add support for WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle .wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    return config;
  },
};

export default nextConfig;
