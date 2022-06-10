/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["upload.wikimedia.org", "ipfs.infura.io"],
  },
};

module.exports = nextConfig;
