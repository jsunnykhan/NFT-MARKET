const hre = require('hardhat');

async function main() {
  const NFtMarket = await hre.ethers.getContractFactory('NFTMarket');
  const VSCoin = await hre.ethers.getContractFactory('VSCoin');
  const Nft = await hre.ethers.getContractFactory('NFT');
  const AuctionMarket = await hre.ethers.getContractFactory('AuctionMarket');

  const nftMarket = await NFtMarket.deploy();
  await nftMarket.deployed();
  const nftMarketAddress = nftMarket.address;

  const vsCoin = await VSCoin.deploy();
  await vsCoin.deployed();
  const vsCoinAddress = vsCoin.address;

  const nft = await Nft.deploy(nftMarketAddress);
  await nft.deployed();
  const nftAddress = nft.address;

  const auctionMarket = await AuctionMarket.deploy();
  await auctionMarket.deployed();
  const auctionMarketAddress = auctionMarket.address;

  console.log({
    nftMarketAddress,
    nftAddress,
    vsCoinAddress,
    auctionMarketAddress,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
