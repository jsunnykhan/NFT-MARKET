import SingleGridView from "../components/SingleGridView";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import axios from "axios";
import Web3Modal from "web3modal";

import { NFT_ADDRESS, Market_ADDRESS } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getNFTS();
  }, []);

  const getNFTS = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac"
    );
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(item.price.toString(), "ether");
        let formateItem = {
          price,
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        };
        return formateItem;
      })
    );
    setNfts((preState) => (preState = items));
  };

  const buyNFT = async (nft) => {
    setProcessing(true);
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(Market_ADDRESS, Market.abi, signer);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const tx = await contract.createMarketSale(NFT_ADDRESS, nft.tokenId, {
      value: price,
    });
    await tx.wait();
    setProcessing(false);
    getNFTS();
  };

  if (!nfts.length) {
    return <h3>No NFT Listed yet !!</h3>;
  }

  console.log(nfts);

  return (
    <div className="grid grid-cols-4 gap-5 my-5 px-5">
      {nfts.map((item) => (
        <SingleGridView
          key={item.tokenId}
          nft={item}
          isBuy={true}
          buyNFT={buyNFT}
          processing={processing}
        />
      ))}
    </div>
  );
}
