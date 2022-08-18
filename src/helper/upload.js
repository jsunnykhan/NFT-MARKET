import { NFTStorage } from 'nft.storage';
import { ipfsToHttp } from './ipfsToHttp.ts';

const nftStorageKey = process.env.NFT_STORAGE_KEY;

export const uploadMetaData = async (_metaData, file) => {
  console.log(nftStorageKey);
  console.log(file);
  const client = new NFTStorage({ token: nftStorageKey });
  const nftMetaData = await client.store({
    name: _metaData.name,
    description: _metaData.description,
    image: file,
    properties: _metaData.attributes,
  });
  console.log(nftMetaData);
  console.log(nftMetaData.url);
  console.log(ipfsToHttp(nftMetaData.url));
  return nftMetaData.url;
};

/**
 * https://bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg.ipfs.nftstorage.link
 *
 *
 * ipfs://bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg
 *
 * https://nftstorage.link/ipfs/bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg
 *
 *
 */

// which one shall i use? ipfs or http
// i can convert from ipfs to http

/**
 *
 * ipfs://bafyreibi3fvnfhapsc346uzp6qs2ogby4h2vdiisglt7khwv4unj5iupfq/metadata.json
 *
 * https://nftstorage.link/ipfs/bafyreibi3fvnfhapsc346uzp6qs2ogby4h2vdiisglt7khwv4unj5iupfq/metadata.json
 */
