import { ethers } from 'ethers';
import Web3 from 'web3';
import {
  market,
  collection,
  Market_ADDRESS,
} from '../../helper/contractImport.ts';
import { ipfsToHttp } from '../../helper/ipfsToHttp.ts';
import axios from 'axios';

export default async function handler(req, res) {
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const { userAddress } = req.query;
  console.log(req.query);
  const web3 = new Web3(baseURL);
  const ethProvier = new ethers.providers.JsonRpcProvider(baseURL);
  const signer = ethProvier.getSigner();

  try {
    const marketContract = new web3.eth.Contract(market.abi, Market_ADDRESS);
    const collections = await marketContract.getPastEvents(
      'CollectionCreated',
      {
        fromBlock: 0,
        toBlock: 'latest',
      }
    );
    let nfts = [];
    await Promise.all(
      collections.map(async (coll) => {
        const address = coll.returnValues.collectionAddress;
        const collectionContract = new ethers.Contract(
          address,
          collection.abi,
          signer
        );
        const totalNftCount = await collectionContract.totalNftCount();
        console.log(totalNftCount.toString());
        for (let index = 1; index <= totalNftCount; index++) {
          const ownerOfNft = await collectionContract.ownerOf(index.toString());
          console.log(`${address} ${index}`);
          if (ownerOfNft.toLowerCase() === userAddress.toLowerCase()) {
            const nftIPFS = await collectionContract.tokenURI(index);
            const nftHTTP = ipfsToHttp(nftIPFS);
            const metadata = await axios.get(nftHTTP);
            const imageUrl = ipfsToHttp(metadata.data.image);
            const nft = {
              id: index.toString(),
              name: metadata.data.name,
              owner: userAddress,
              image: imageUrl,
              description: metadata.data.description,
              properties: metadata.data.properties,
              collectionAddress: address,
            };
            nfts.push(nft);
          }
        }
      })
    );
    console.log(nfts);
    res.status(200).json({ nfts: nfts });
  } catch (error) {
    res.status(400).json(error);
  }
}
