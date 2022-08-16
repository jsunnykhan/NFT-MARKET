import { NFTStorage, File } from "nft.storage";
import mime from "mime";

const NFT_STORAGE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4MUI0MjAwMDJhNDU0YzJmRDk1NTFmOGE0QTdENkVBODQzRDRiOTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDE5MTE2NjI2MiwibmFtZSI6Ik1hcmtldFBsYWNlIn0.PRmPgRxYx-0AZIg8YCP3-ltZHOAd6GB9HoAEE3taazg";

export const uploadFile = async (file) => {
  console.log(file);
  let url = "";
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const cid = await client.storeBlob(file);
  url = `https://ipfs.io/ipfs/${cid}`;
  console.log(url);
  return url;
};

export const uploadMetaData = async (metaData, file) => {
  console.log(file);
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  const metadata = await client.store({
    name: metaData.name,
    description: metaData.description,
    image: file,
    properties: metaData.attributes,
  });
  console.log(metadata);
  console.log(metadata.url);
  return metadata.url;
};
