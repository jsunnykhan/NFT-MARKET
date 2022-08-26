const { arr } = require("../secret")
export default async function handler(req: any, res: any) {
  const { ownerPrivateKey, beneficiaryPrivateKey } = req.body;

  if (process.env.PRIVATE_KEY) {
    const PRIVATE_KEY: string = process.env.PRIVATE_KEY;

    if (PRIVATE_KEY === ownerPrivateKey) {
      console.log(arr)
      if (arr.length) {
        arr.push(beneficiaryPrivateKey);
        res.status(200).json({ message: "successfully save new beneficiary" });
      }
      res.status(400).json({ error: "No owner found" });
    }
    res.status(400).json({ error: "Owner not match" });
  }


}
