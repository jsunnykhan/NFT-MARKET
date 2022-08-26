require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

module.exports = {
  // defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    localhost: {
      url: baseUrl,
    },
    rinkeby: {
      url: baseUrl,
      accounts: {
        mnemonic: privateKey,
      },
      confirmations: 2,
      // gas: 21000000,
      // gasPrice: 8000000000,
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: "0.8.11",
};
