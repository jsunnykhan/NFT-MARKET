const hre = require('hardhat');
const fs = require('fs');

async function main() {
  const NFtMarket = await hre.ethers.getContractFactory('NFTMarket');
  const Auction = await hre.ethers.getContractFactory('AuctionMarket');

  const VSCoin = await hre.ethers.getContractFactory('VSCoin');
  const Nft = await hre.ethers.getContractFactory('Collection');

  const nftMarket = await NFtMarket.deploy(10);
  await nftMarket.deployed();
  const nftMarketAddress = nftMarket.address;

  const vsCoin = await VSCoin.deploy();
  await vsCoin.deployed();
  const vsCoinAddress = vsCoin.address;

  const nft = await Nft.deploy('Default collection', 'DFC', nftMarket.address);
  await nft.deployed();
  const nftAddress = nft.address;

  const auction = await Auction.deploy();
  await auction.deployed();
  const auctionAddress = auction.address;

  const configFile = `export const Market_ADDRESS = "${nftMarketAddress}";
export const NFT_ADDRESS = "${nftAddress}";
export const ERC20_TOKEN = "${vsCoinAddress}";
export const AUCTION_MARKET = "${auctionAddress}";
  `;

  fs.writeFileSync('./config.js', configFile);

  console.log({ nftMarketAddress, nftAddress, vsCoinAddress, auctionAddress });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
