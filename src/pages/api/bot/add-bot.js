export default async function handler(req, res) {
  const { ownerPrivateKey, beneficiaryAddress } = req.query;

  console.log(ownerPrivateKey, beneficiaryAddress);
}
