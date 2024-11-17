import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true, // Enable SVG images
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;", // Add a CSP for security
  },
  output: "standalone", // Enable standalone output
  /* other config options here */
};

export default nextConfig;
