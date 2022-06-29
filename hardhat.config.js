require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
require("@nomiclabs/hardhat-etherscan");

require("dotenv").config();

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();

module.exports = {
  // defaultNetwork: "rinkeby",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:7545",
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac`,
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
