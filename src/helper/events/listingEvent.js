import Web3 from 'web3';
import { market } from 'helper/contractImport';

export const _getApprovalEvents = async (marketAddress, tokenId) => {
  const web3 = new Web3(window.ethereum);
  const marketContract = new web3.eth.Contract(market.abi, marketAddress);

  const eventFilter = {
    filter: {
      tokenId: tokenId,
    },
    fromBlock: 0,
    toBlock: 'latest',
  };

  const listingEvents = await collectionContract.getPastEvents(
    'listing',
    eventFilter
  );

  return listingEvents;
};
