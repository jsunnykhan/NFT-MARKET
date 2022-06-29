const hre = require("hardhat");


async function main() {
  const Nft = await hre.ethers.getContractFactory("NFT");
  const nft = await Nft.deploy("0x75BB1ee624DabfC163C4FfCc999e39D84231f947");
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
