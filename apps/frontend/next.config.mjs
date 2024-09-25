/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@types"],
  webpack: (config) => {
    config.resolve.fallback = {
      net: false,
      tls: false,
      fs: false,
      readline: false,
    };
    return config;
  },
};

export default nextConfig;
