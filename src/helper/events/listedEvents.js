import { ethers } from 'ethers';
import Web3 from 'web3';
import {
  market,
  Market_ADDRESS,
  auction,
  AUCTION_MARKET,
} from '../contractImport.ts';

export const _getListingStatus = async (tokenId, collectionAddress, owner) => {
  const web3 = new Web3(window.ethereum);
  const marketContract = new web3.eth.Contract(market.abi, Market_ADDRESS);
  const auctionContract = new web3.eth.Contract(auction.abi, AUCTION_MARKET);

  const eventFilterMarket = {
    filter: {
      tokenId: tokenId,
      collectionAddress: collectionAddress,
      owner: owner,
    },
    fromBlock: 0,
    toBlock: 'latest',
  };

  const eventFilterAuction = {
    filter: {
      tokenId: tokenId,
      collectionAddress: collectionAddress,
      seller: owner,
    },
    from: 0,
    toBlock: 'latest',
  };

  const listingEvents = await marketContract.getPastEvents(
    'listed',
    eventFilterMarket
  );

  const auctionListing = await auctionContract.getPastEvents(
    'AuctionListed',
    eventFilterAuction
  );
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const auctionEtherContract = new ethers.Contract(
    AUCTION_MARKET,
    auction.abi,
    signer
  );
  const marketEtherContract = new ethers.Contract(
    Market_ADDRESS,
    market.abi,
    signer
  );

  console.log(listingEvents);
  console.log(auctionListing);

  console.log(listingEvents.length);
  console.log(auctionListing.length);
  if (listingEvents.length !== 0) {
    const listingId =
      listingEvents[listingEvents.length - 1].returnValues.listingId;
    const isListed = await marketEtherContract.getListingStatus(listingId);
    console.log(isListed);
    return isListed;
  } else if (auctionListing.length !== 0) {
    const auctionId =
      auctionListing[auctionListing.length - 1].returnValues.auctionId;
    const isListed = await auctionEtherContract.getAuctionListingStatus(
      auctionId
    );
    console.log(isListed);
    return isListed;
  }

  return false;
};
