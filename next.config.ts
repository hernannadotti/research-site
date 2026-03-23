import type { NextConfig } from 'next'
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin'
import { env, nodeless } from 'unenv'
import { resolve } from 'path'

const { alias: turbopackAlias } = env(nodeless, {})

const nextConfig: NextConfig = {
  // Turbopack
  turbopack: {
    // Prevent Next from inferring the workspace root from another lockfile
    // elsewhere on your machine.
    root: resolve(__dirname),
    resolveAlias: {
      ...turbopackAlias,
    },
  },
  // Webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(new NodePolyfillPlugin())
    }
    return config
  },
}

export default nextConfig

