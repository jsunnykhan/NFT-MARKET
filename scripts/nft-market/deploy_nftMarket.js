const { ethers, upgrades } = require("hardhat");

async function main() {
  const NFtMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await upgrades.deployProxy(NFtMarket, {
    initializer: "initialize",
  });
  await nftMarket.deployed();
  console.log("Market deployed to:", nftMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
