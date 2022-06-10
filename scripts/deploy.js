const hre = require("hardhat");

async function main() {
  const NFtMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFtMarket.deploy();
  await nftMarket.deployed();
  console.log("NFTMarket deployed to:", nftMarket.address);

  const Nft = await hre.ethers.getContractFactory("NFT");
  const nft = await Nft.deploy(nftMarket.address);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
