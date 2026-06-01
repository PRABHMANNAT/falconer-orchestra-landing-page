import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root — unrelated lockfiles exist higher up the tree.
  turbopack: {
    root: __dirname
  }
};

export default nextConfig;
