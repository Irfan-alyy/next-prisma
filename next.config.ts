import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript:{
    ignoreBuildErrors:true
  },
  eslint:{
    ignoreDuringBuilds:true
  },
  images:{
    remotePatterns:[new URL("https://avatars.githubusercontent.com/*")]
  }
};

export default nextConfig;
