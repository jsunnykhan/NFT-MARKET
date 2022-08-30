import { ethers } from 'ethers';
import Web3Modal from 'web3modal';

import {
  collection,
  market,
  token,
  auction,
  NFT_ADDRESS,
  Market_ADDRESS,
  ERC20_TOKEN,
  AUCTION_MARKET,
} from './contractImport';
import { _getCollectionContract } from '../helper/contracts';
import { ipfsToHttp } from './ipfsToHttp';
import axios from 'axios';
import { _getOwnCollections } from './events';

const configure = async (): Promise<ethers.providers.Web3Provider> => {
  const web3modal = new Web3Modal();
  const connectMA = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connectMA);
  return provider;
};

export const _minting = async (url: string, contractAddress: string) => {
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

export const _getTokenUri = async (address: string, tokenId: string) => {
  const tokenUri = await _getCollectionContract(address).tokenURI(tokenId);
  const uri = ipfsToHttp(tokenUri);
  const { data } = await axios.get(uri);
  return data;
};

export const _listingToMarket = async (
  tokenId: number,
  price: string,
  collectionAddress: string
) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    signer
  );
  const pri = ethers.utils.parseUnits(price, 'ether');
  const transaction = await marketContract.createListing(
    tokenId,
    collectionAddress,
    pri
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

export const _getDefaultCollection = async () => {
  const collectionContract = _getCollectionContract(NFT_ADDRESS);
  try {
    const name = await collectionContract.name();
    const symbol = await collectionContract.symbol();
    const ownerOf = await collectionContract.contractOwner();
    const newItem = {
      address: NFT_ADDRESS,
      name: name,
      owner: ownerOf,
      symbol: symbol,
    };

    return newItem;
  } catch (error) {
    console.error(error);
  }
};

export const _getAllOwnedCollection = async (account: string) => {
  try {
    const coll: Array<any> = await _getOwnCollections(account);

    const defaultCollection = await _getDefaultCollection();

    const filteredCollection = coll.filter(
      (item: any) =>
        item.returnValues.collectionAddress !== defaultCollection?.address
    );

    const sortedCollections = filteredCollection.map((item: any) => {
      const newItem = {
        address: item.returnValues.collectionAddress,
        name: item.returnValues.name,
        owner: item.returnValues.owner,
        symbol: item.returnValues.symbol,
      };
      return newItem;
    });

    return [defaultCollection, ...sortedCollections];
  } catch (error) {
    console.log(error);
  }
};

export const _getOwnerOfCollection = async (address: string) => {
  const collectionContract = _getCollectionContract(address);
  const owner = await collectionContract.contractOwner();
  return owner;
};
