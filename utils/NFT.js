import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { NFT_ADDRESS, Market_ADDRESS } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/market/NFTMarket.sol/NFTMarket.json";

const configure = async () => {
  const web3modal = new Web3Modal();
  const connectMA = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connectMA);
  return provider;
};

export const _minting = async (url) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
  let transaction = await nftContract.createNewToken(url);
  let tx = await transaction.wait();
  console.log(tx);

  const event = tx.events[0];
  const value = event.args.tokenId;
  const tokenId = value.toString();

  return tokenId;
};

export const _getMintedNFT = async () => {
  const provider = await configure();
  const signer = provider.getSigner();
  const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);

  const mintedNFT = await nftContract.getMintedNFT();
  return mintedNFT;
};

export const _listingToMarket = async (tokenId, price) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    Market_ADDRESS,
    Market.abi,
    signer
  );

  let listingPrice = await marketContract.getMarketListingPrice();
  listingPrice = listingPrice.toString();
  const pri = ethers.utils.parseUnits(price, "ether");
  const transaction = await marketContract.addItemInMarket(
    NFT_ADDRESS,
    tokenId,
    pri,
    { value: listingPrice }
  );

  const tx = await transaction.wait();

  return tx;
};
