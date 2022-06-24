const hre = require("hardhat");


async function main() {
  const Nft = await hre.ethers.getContractFactory("NFT");
  const nft = await Nft.deploy("0xD7cac40163B6974673f23924cD950F47008Ad3D1");
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
