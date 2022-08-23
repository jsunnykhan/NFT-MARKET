import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import { market, Market_ADDRESS, ERC20_TOKEN } from './contractImport';

const configure = async (): Promise<ethers.providers.Web3Provider> => {
  const web3modal = new Web3Modal();
  const connectMA = await web3modal.connect();
  const provider = new ethers.providers.Web3Provider(connectMA);
  return provider;
};

export const _getListedItemStatus = async (listingId: any) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    signer
  );
  const listedItemStatus = await marketContract.getListingStatus(listingId);
  console.log(listedItemStatus);
  return listedItemStatus;
};

export const _getNftPrice = async (listingId: any) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    signer
  );

  const listedItem = await marketContract.getListing(listingId);
  console.log(listedItem.price);
  const priceInEth = ethers.utils.formatUnits(
    listedItem.price.toString(),
    'ether'
  );

  return priceInEth;
};

export const _buyNft = async (
  listingId: any,
  collectionAddress: string,
  price: string
) => {
  const provider = await configure();
  const signer = provider.getSigner();
  const marketContract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    signer
  );

  const priceInWei = ethers.utils.parseUnits(price.toString(), 18);
  console.log(priceInWei.toString());

  const tx = await marketContract.buyListingItem(
    collectionAddress,
    listingId,
    priceInWei,
    ERC20_TOKEN
  );

  tx.wait();
};
