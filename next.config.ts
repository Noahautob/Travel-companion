import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root to this project so a stray parent package-lock.json
  // doesn't confuse module resolution.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
