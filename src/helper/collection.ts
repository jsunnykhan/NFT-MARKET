import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { NFT_ADDRESS, Market_ADDRESS } from '../../config';
import collection from '../../artifacts/contracts/market/Collection.sol/Collection.json';
import market from '../../artifacts/contracts/market/NFTMarket.sol/NFTMarket.json';
import { ipfsToHttp } from './ipfsToHttp';
import axios from 'axios';


const configure = async (): Promise<ethers.providers.Web3Provider> => {
  const web3modal = new Web3Modal();
  const connectMA = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connectMA);
  return provider;
};

export const _minting = async (url: string, contractAddress: string) => {
  console.log(contractAddress);
  const provider = await configure();
  const signer = provider.getSigner();
  const collectionContract = new ethers.Contract(
    contractAddress,
    collection.abi,
    signer
  );
  let transaction = await collectionContract.createToken(url);
  let tx = await transaction.wait();
  console.log(tx);

  const event = tx.events[0];
  const value = event.args.tokenId;
  const tokenId = value.toString();
  console.log(typeof tokenId);
  return tokenId;
};

export const _getMintedNFT = async () => {
  const provider = await configure();
  const signer = provider.getSigner();
  const collectionContract = new ethers.Contract(
    NFT_ADDRESS,
    collection.abi,
    signer
  );

  const mintedNFT = await collectionContract.getMintedNFT();
  return mintedNFT;
};

export const _listingToMarket = async (tokenId: number, price: string) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    signer
  );

  let listingPrice = await marketContract.getMarketListingPrice();
  listingPrice = listingPrice.toString();
  const pri = ethers.utils.parseUnits(price, 'ether');
  const transaction = await marketContract.addItemInMarket(
    NFT_ADDRESS,
    tokenId,
    pri,
    { value: listingPrice }
  );

  const tx = await transaction.wait();

  return tx;
};

export const _getSingleNft = async (tokenId: any, collectionAddress: any) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const collectionContract = new ethers.Contract(
    collectionAddress,
    collection.abi,
    signer
  );

  const ipfsURL = await collectionContract.tokenURI(tokenId);
  console.log(ipfsURL);
  const httpURL = ipfsToHttp(ipfsURL);
  const response = await axios.get(httpURL, { timeout: 10000 });
  const owner = await collectionContract.ownerOf(tokenId);
  const imageUrl = ipfsToHttp(response.data.image);
  console.log(response.data);
  const nft = {
    name: response.data.name,
    owner,
    imageUrl,
    description: response.data.description,
    properties: response.data.properties,
  };
  console.log(nft);
  return nft;
};
