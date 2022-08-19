import Web3 from 'web3';
import { collection } from 'helper/contractImport';

export const _getCreator = async (collectionAddress, tokenId) => {
  const web3 = new Web3(window.ethereum);
  const collectionContract = new web3.eth.Contract(
    collection.abi,
    collectionAddress
  );

  const eventFilter = {
    filter: {
      tokenId: tokenId,
      from: '0x0000000000000000000000000000000000000000',
    },
    fromBlock: 0,
    toBlock: 'latest',
  };

  const createEvent = await collectionContract.getPastEvents(
    'Transfer',
    eventFilter
  );

  console.log(createEvent[0].returnValues.to);

  return createEvent[0].returnValues.to;
};

