/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['upload.wikimedia.org', 'ipfs.infura.io'],
  },
  env: {
    PRIVATE_KEY:
      '0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6',
  },
};

module.exports = nextConfig;
