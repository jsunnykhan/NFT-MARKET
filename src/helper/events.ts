import { market, Market_ADDRESS, collection } from "./contractImport";
import Web3 from "web3";

export const _getAllCollections = async () => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const web3 = new Web3(baseURL!);
  const abi: any = market.abi;
  if (abi) {
    const marketContract = new web3.eth.Contract(abi, Market_ADDRESS);
    const collections = await marketContract.getPastEvents(
      "CollectionCreated",
      {
        fromBlock: 0,
        toBlock: "latest",
      }
    );

    return collections;
  } else {
    return "ABI Not Found"
  }
};


export const _getCollectionMintedItems = async (address: string) => {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const web3 = new Web3(baseURL!);
  const abi: any = collection.abi;
  if (abi) {
    const collection = new web3.eth.Contract(abi, address);
    const collections = await collection.getPastEvents(
      "Transfer",
      {
        filter: {
          from: "0x0000000000000000000000000000000000000000",
        },
        fromBlock: 0,
        toBlock: "latest",
      }
    );

    return collections;
  } else {
    return "ABI Not Found"
  }
};