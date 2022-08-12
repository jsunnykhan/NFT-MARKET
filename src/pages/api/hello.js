// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
export default function handler(req, res) {
  const endTime = Date.now() + 7200;
  const remaining = endTime - Date.now();

  setTimeout(() => {
    console.log("time out");
  }, remaining);

  res.status(200).json({ name: remaining });
}
