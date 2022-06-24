import { create as ipfsHttpClient } from "ipfs-http-client";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const _uploadFile = async (file) => {
  let url = "";
  try {
    const data = await client.add(file, {
      progress: (progress) => console.log({ progress }),
    });
    console.log({ data });
    url = `https://ipfs.infura.io/ipfs/${data.path}`;
  } catch (error) {
    console.error(error);
  }
  return url;
};

export const _uploadMetaData = async (data) => {
  let url = "";
  try {
    const nftData = await client.add(data);
    console.log({ nftData });
    url = `https://ipfs.infura.io/ipfs/${nftData.path}`;
  } catch (error) {
    console.error(error);
  }

  return url;
};
