import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  turbopack: { root: __dirname },
  // Serve _next content when requests hit /next/ (e.g. proxy/CDN strips underscore)
  async rewrites() {
    return [
      { source: "/next/:path*", destination: "/_next/:path*" },
    ];
  },
};

export default nextConfig;
