/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['cuer'],
  images: {
    domains: [
      "polymarket-upload.s3.us-east-2.amazonaws.com",
      "i.imgur.com",
      "raw.githubusercontent.com",
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
};

export default nextConfig;
