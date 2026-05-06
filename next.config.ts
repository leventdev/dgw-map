import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://api.beta.deliverygateway.io/**"),
    ],
  },
  devIndicators: false,
};

export default nextConfig;
