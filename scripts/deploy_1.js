const hre = require("hardhat");

async function main() {
  const NFtMarket = await hre.ethers.getContractFactory("NFTMarket");
  const nftMarket = await NFtMarket.deploy();
  await nftMarket.deployed();
  console.log("Market deployed to:", nftMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
