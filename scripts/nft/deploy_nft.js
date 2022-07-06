const { ethers, upgrades } = require("hardhat");

async function main() {
  const Nft = await ethers.getContractFactory("NFT");
  const nft = await upgrades.deployProxy(Nft, [
    [0xe0adddea8c3ab333413703c3f3cb2cb153288a9a],
  ]);
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
