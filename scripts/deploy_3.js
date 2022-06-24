const { ethers, upgrades } = require("hardhat");

async function main() {
  const MyToken = await hre.ethers.getContractFactory("MyToken");
  const myToken = await upgrades.deployProxy(MyToken, {
    initializer: "initialize",
  });
  // await myToken.deployed();
  console.log("Token deployed to:", myToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
