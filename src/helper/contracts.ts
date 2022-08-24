import { BigNumber, ethers } from 'ethers';
import {
  NFT_ADDRESS,
  collection,
  Market_ADDRESS,
  market,
  ERC20_TOKEN,
  token,
  AUCTION_MARKET,
  auction,
} from './contractImport';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;


const _getProvider = () => {
  const jsonRpcProvider: ethers.providers.JsonRpcProvider =
    new ethers.providers.JsonRpcProvider(baseURL);
  return jsonRpcProvider;
};

export const _getCollectionContract = (
  address = NFT_ADDRESS
): ethers.Contract => {
  const contract: ethers.Contract = new ethers.Contract(
    address,
    collection.abi,
    _getProvider()
  );
  return contract;

};

export const _getMarketContract = (): ethers.Contract => {
  const contract: ethers.Contract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    _getProvider()
  );
  return contract;
};

export const _getERC20Contract = () => {
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


export const _getBalance = async (address: string) => {
  const balance = await _getProvider().getBalance(address);
  return Number(balance.toString()) / 10 ** 18;
}

export const _getNativeBalance = async (address: string) => {
  const balance = await _getERC20Contract().balanceOf(address);
  return Number(balance.toString()) / 10 ** 18;
}