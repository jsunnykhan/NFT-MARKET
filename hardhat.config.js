require('@nomiclabs/hardhat-waffle');
require('@openzeppelin/hardhat-upgrades');
require('@nomiclabs/hardhat-etherscan');

require('dotenv').config({ path: __dirname + '/.env.development' });

const fs = require('fs');
const privateKey = fs.readFileSync('.secret').toString();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const goerliUrl = process.env.NEXT_ALCHEMY_API;
console.log(goerliUrl);

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
    goerli: {
      baseUrl: goerliUrl,
      accounts: {
        mnemonic: privateKey,
      }
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  solidity: '0.8.11',
};
