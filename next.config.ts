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
    remotePatterns:[new URL("https://lh3.googleusercontent.com")]
  }
};

export default nextConfig;
