import Web3 from 'web3';
import { collection } from 'helper/contractImport';

export const _getApprovalEvents = async (collectionAddress, tokenId) => {
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

  const approvalEvents = await collectionContract.getPastEvents(
    'Approval',
    eventFilter
  );

  return approvalEvents;
};
