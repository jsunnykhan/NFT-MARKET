require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();

module.exports = {
  defaultNetwork: "rinkeby",
  networks: {
    
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac`,
      accounts: {
        mnemonic: privateKey,
      },
      confirmations: 2,
      gas: 21000000,
      gasPrice: 8000000000,
    },
  },
  solidity: "0.8.11",
};
