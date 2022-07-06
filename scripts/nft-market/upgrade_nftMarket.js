const { ethers, upgrades } = require("hardhat");

async function main() {
  const NFTMarket = await ethers.getContractFactory("NFTMarket");
  const nftMarket = await upgrades.upgradeProxy(
    "0x75BB1ee624DabfC163C4FfCc999e39D84231f947",
    NFTMarket
  );
  await nftMarket.deployed();
  console.log("Token deployed to:", nftMarket.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
