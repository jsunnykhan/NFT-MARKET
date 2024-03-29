const { token, ERC20_TOKEN } = require("../../helper/contractImport.ts");
const ethers = require("ethers");

export default async function handler(req, res) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const { amount, address, eth } = req.body;
  const privateKey = process.env.PRIVATE_KEY;

  try {
    const provider = new ethers.providers.JsonRpcProvider(baseUrl);
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(ERC20_TOKEN, token.abi, signer);

    const transfer = await contract.verifySwapHash(eth, address, amount);
    await transfer.wait();

    res.status(200).json({ tx: transfer });
  } catch (error) {
    res.status(400).json(error);
  }
}
