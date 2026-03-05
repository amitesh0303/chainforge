import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {},
  serverExternalPackages: ['@node-rs/argon2', '@node-rs/bcrypt'],
};

export default nextConfig;
