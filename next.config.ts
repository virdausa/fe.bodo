import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://api.nerpai.space/api/:path*", // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
