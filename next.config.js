/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["upload.wikimedia.org", "ipfs.infura.io", "nftstorage.link"],
  },
};

module.exports = nextConfig;
