import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL("https://api.beta.deliverygateway.io/**"),
    ],
  },
};

export default nextConfig;
