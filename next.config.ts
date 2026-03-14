import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize third-party packages for tree-shaking
  optimizePackageImports: ["framer-motion", "lucide-react"],

  // Enable gzip compression
  compress: true,

  // Remove X-Powered-By header
  poweredByHeader: false,

  // Security & performance headers
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
      ],
    },
    {
      // Long cache for immutable static assets
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
  ],
};

export default nextConfig;
