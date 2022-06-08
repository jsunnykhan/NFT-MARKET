require("@nomiclabs/hardhat-waffle");

const fs = require("fs");
const privateKey = fs.readFileSync(".secret").toString();

module.exports = {
  networks: {
    hardhat: {},
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac`,
      accounts: [privateKey],
    },
    mainNet: {},
  },
  solidity: "0.8.11",
};
