<<<<<<< HEAD
import { ethers } from 'ethers';
import {
  NFT_ADDRESS,
  Market_ADDRESS,
  ERC20_TOKEN,
  AUCTION_MARKET,
} from '../../config';
import collection from '../../artifacts/contracts/market/Collection.sol/Collection.json';
import market from '../../artifacts/contracts/market/NFTMarket.sol/NFTMarket.json';
import token from '../../artifacts/contracts/token/ERC20/VsCoin.sol/VSCoin.json';
import auction from '../../artifacts/contracts/market/AuctionMarket.sol/AuctionMarket.json';
=======

import { ethers } from "ethers";
import { NFT_ADDRESS, collection, Market_ADDRESS, market, ERC20_TOKEN, token, AUCTION_MARKET, auction } from "./contractImport";
>>>>>>> 11a9bc8 (fetch data from chain and useConnect hook created)

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const URL: string = 'http://127.0.0.1:8545';

const _getProvider = (): ethers.providers.JsonRpcProvider => {
<<<<<<< HEAD
  console.log(URL);
  const jsonRpcProvider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(URL);
  return jsonRpcProvider;
};

export const _getCollectionContract = (): ethers.Contract => {
  const contract: ethers.Contract = new ethers.Contract(
    NFT_ADDRESS,
    collection.abi,
    _getProvider()
  );
  return contract;
};
=======
    const jsonRpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(URL);
    return jsonRpcProvider;
}

export const _getCollectionContract = (address = NFT_ADDRESS): ethers.Contract => {
    const contract: ethers.Contract = new ethers.Contract(address, collection.abi, _getProvider());
    return contract;
}
>>>>>>> 11a9bc8 (fetch data from chain and useConnect hook created)

export const _getMarketContract = (): ethers.Contract => {
  const contract: ethers.Contract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    _getProvider()
  );
  return contract;
};

export const _getERC20Contract = (): ethers.Contract => {
  const contract: ethers.Contract = new ethers.Contract(
    ERC20_TOKEN,
    token.abi,
    _getProvider()
  );
  return contract;
};

export const _getAuctionContract = (): ethers.Contract => {
  const contract = new ethers.Contract(
    AUCTION_MARKET,
    auction.abi,
    _getProvider()
  );
  return contract;
};
