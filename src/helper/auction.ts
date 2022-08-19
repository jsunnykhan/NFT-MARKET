import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { Market_ADDRESS, AUCTION_MARKET, ERC20_TOKEN } from '../../config';
import Auction from '../../artifacts/contracts/market/AuctionMarket.sol/AuctionMarket.json';

const configureProvider = async (): Promise<ethers.providers.Web3Provider> => {
  const web3Modal = new Web3Modal();
  const connectMM = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connectMM);
  return provider;
};

export const _startAuction = async (
  collectionAddress: string,
  tokenId: any,
  creator: string,
  biddingTime: any,
  baseValue: any
) => {
  const provider = await configureProvider();
  const signer = provider.getSigner();
  const auctionMarket = new ethers.Contract(
    AUCTION_MARKET,
    Auction.abi,
    signer
  );
  const valueInWei = ethers.utils.parseEther(baseValue);
  console.log(valueInWei);
  const transactionGoing = await auctionMarket.startAuction(
    collectionAddress,
    tokenId,
    creator,
    biddingTime,
    valueInWei,
    {
      value: ethers.utils.parseUnits('.01', 'ether'),
    }
  );
  const tx = await transactionGoing.wait();
  console.log(tx);

  // can be used to fetch additional information
};

export const _bid = async (auctionId: any, amount: any) => {
  const provider = await configureProvider();
  const signer = provider.getSigner();
  const auctionMarket = new ethers.Contract(
    AUCTION_MARKET,
    Auction.abi,
    signer
  );
  const transactionGoing = await auctionMarket.bid(
    auctionId,
    ethers.utils.parseUnits(amount, 'ether'),
    ERC20_TOKEN
  );
  const tx = await transactionGoing.wait();
  console.log(tx);
};

// from backend
export const _endAuction = async (auctionId: any) => {
  const provider = await configureProvider();
  const signer = provider.getSigner();
  const auctionMarket = new ethers.Contract(
    AUCTION_MARKET,
    Auction.abi,
    signer
  );
  const transactionGoing = await auctionMarket.auctionEnd(
    auctionId,
    ERC20_TOKEN
  );
  const tx = await transactionGoing.wait();
  console.log(tx);
};

export const _getAllAuctionItems = async () => {
  const provider = await configureProvider();
  const signer = provider.getSigner();
  const auctionMarket = new ethers.Contract(
    AUCTION_MARKET,
    Auction.abi,
    signer
  );
  const transactionGoing = await auctionMarket.getAllAuctionItems();
  const tx = transactionGoing.wait();
  console.log(tx);
};

export const _getSingleAuctionItem = async (auctionId: any) => {
  const provider = await configureProvider();
  const signer = provider.getSigner();
  const auctionMarket = new ethers.Contract(
    AUCTION_MARKET,
    Auction.abi,
    signer
  );
  console.log(auctionId);
  const transactionGoing = await auctionMarket.getSingleAuctionItem(auctionId);
  console.log(transactionGoing);
  return transactionGoing;
};
