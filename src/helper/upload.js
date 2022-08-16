import { NFTStorage, File } from 'nft.storage';
import mime from 'mime';

const NFT_STORAGE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDY4MUI0MjAwMDJhNDU0YzJmRDk1NTFmOGE0QTdENkVBODQzRDRiOTIiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDE5MTE2NjI2MiwibmFtZSI6Ik1hcmtldFBsYWNlIn0.PRmPgRxYx-0AZIg8YCP3-ltZHOAd6GB9HoAEE3taazg';

export const uploadFile = async (file) => {
  console.log(file);
  let url = '';
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
  const ipfsLink = metadata.data.image.href;
  console.log(metadata.data.image.href);
  const tempUrl = ipfsLink.slice(7, ipfsLink.length);
  const finalUrl = 'https://nftstorage.link/ipfs/' + tempUrl;
  console.log(finalUrl);
  return metadata.url;
};

/*
https://bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg.ipfs.nftstorage.link


ipfs://bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg

https://nftstorage.link/ipfs/bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg

https://nftstorage.link/ipfs/bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper
*/


// which one shall i use? ipfs or http
// i can convert from ipfs to http


/**
 *
 * ipfs://bafyreibi3fvnfhapsc346uzp6qs2ogby4h2vdiisglt7khwv4unj5iupfq/metadata.json
 *
 * https://nftstorage.link/ipfs/bafyreibi3fvnfhapsc346uzp6qs2ogby4h2vdiisglt7khwv4unj5iupfq/metadata.json
 */
