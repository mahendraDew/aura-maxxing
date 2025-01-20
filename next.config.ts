import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['images.unsplash.com', 'avatars.githubusercontent.com', 'pictures-storage.storage.eu-north1.nebius.cloud'], // Add the domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pictures-storage.storage.eu-north1.nebius.cloud',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 60, 
  },
};

export default nextConfig;
