import Web3 from 'web3';
import { collection } from 'helper/contractImport';

export const _getTransferEvents = async (collectionAddress, tokenId) => {
  console.log(collectionAddress);
  console.log(tokenId);
  const web3 = new Web3(window.ethereum);
  const collectionContract = new web3.eth.Contract(
    collection.abi,
    collectionAddress
  );

  const eventFilter = {
    filter: {
      tokenId: tokenId,
    },
    fromBlock: 0,
    toBlock: 'latest',
  };

  const transferEvents = await collectionContract.getPastEvents(
    'Transfer',
    eventFilter
  );

  return transferEvents;
};
