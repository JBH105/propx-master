import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com", "picsum.photos", "storage.googleapis.com"],
  },
};

export default nextConfig;
