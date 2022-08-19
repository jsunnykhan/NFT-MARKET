import Web3 from 'web3';
import { auction, AUCTION_MARKET } from 'helper/contractImport';

export const _getBidEvents = async (auctionId) => {
  const web3 = new Web3(window.ethereum);
  const auctionContract = new web3.eth.Contract(auction.abi, AUCTION_MARKET);
  console.log(auctionId);
  const eventFilter = {
    filter: {
      auctionId: auctionId,
    },
    fromBlock: 0,
    toBlock: 'latest',
  };

  const bidEvents = await auctionContract.getPastEvents('Bid', eventFilter);

  console.log(bidEvents);

  return bidEvents;
};
