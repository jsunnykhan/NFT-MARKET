/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['upload.wikimedia.org', 'ipfs.infura.io', 'nftstorage.link'],
  },
  env: {
    NFT_STORAGE_KEY:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4MUI0MjAwMDJhNDU0YzJmRDk1NTFmOGE0QTdENkVBODQzRDRiOTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDE5MTE2NjI2MiwibmFtZSI6Ik1hcmtldFBsYWNlIn0.PRmPgRxYx-0AZIg8YCP3-ltZHOAd6GB9HoAEE3taazg',
  },
};

module.exports = nextConfig;
