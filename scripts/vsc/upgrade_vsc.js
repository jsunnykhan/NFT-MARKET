const { ethers, upgrades } = require("hardhat");

async function main() {
  const VSCoin = await ethers.getContractFactory("VSCoin");
  const vsCoin = await upgrades.upgradeProxy(
    "0x517E2aD6ebdDc0139233FF73792B144c5011d3CD",
    VSCoin
  );
  await vsCoin.deployed();
  console.log("Token deployed to:", vsCoin.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
