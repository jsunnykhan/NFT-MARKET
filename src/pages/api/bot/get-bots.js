const { arr } = require("../secret");
const ethers = require("ethers");
export default async function handler(req, res) {
  if (arr.length) {
    const publicKeys = arr.map((d) => {
      const wallet = new ethers.Wallet(d);
      return wallet.address;
    });
    res.status(200).json(publicKeys);
   
  }
  res.status(404).json("no beneficiary Found");
}
