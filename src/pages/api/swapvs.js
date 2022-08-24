const { token, ERC20_TOKEN } = require("../../helper/contractImport.ts");
const ethers = require("ethers");


export default async function handler(req, res) {
  const { amount, address } = req.body;
  const privateKey =
    "dd10cb3629ab6ed22b42395b8c3795f8de4a9d7a4767de6ac1652a4970495bcc";

  try {
    const value = ethers.utils.parseUnits(amount.toString(), "ether");
    const provider = new ethers.providers.JsonRpcProvider(
      "http://127.0.0.1:7545"
    );
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(ERC20_TOKEN, token.abi, signer);
    const transfer = await contract.transfer(address, value);
    await transfer.wait();

    res.status(200).json({ tx: transfer });
  } catch (error) {
    res.status(400).json(error);
  }
}
