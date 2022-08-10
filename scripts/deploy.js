const { ethers } = require('hardhat');
const hre = require('hardhat');

async function main() {
  const NFtMarket = await hre.ethers.getContractFactory('NFTMarket');
  const VSCoin = await hre.ethers.getContractFactory('VSCoin');
  const Nft = await hre.ethers.getContractFactory('NFT');

  const nftMarket = await NFtMarket.deploy(
    ethers.utils.parseUnits('1', 'ether')
  );
  await nftMarket.deployed();
  const nftMarketAddress = nftMarket.address;

  const vsCoin = await VSCoin.deploy();
  await vsCoin.deployed();
  const vsCoinAddress = vsCoin.address;

  const nft = await Nft.deploy(nftMarketAddress, 'Default', 'DEF');
  await nft.deployed();
  const nftAddress = nft.address;

  console.log({ nftMarketAddress, nftAddress, vsCoinAddress });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
