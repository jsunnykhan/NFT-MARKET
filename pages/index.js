import SingleGridView from "../components/SingleGridView";
import { ethers } from "ethers";
import { useEffect, useState } from "react";


import { BallTriangle } from "react-loader-spinner";

import axios from "axios";
import Web3Modal from "web3modal";

import { NFT_ADDRESS, Market_ADDRESS, ERC20_TOKEN } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getNFTS();
  }, []);

  const getNFTS = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac"
      // "http://127.0.0.1:7545"
    );
    setLoading(true);
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
    setLoading(false);
  };
  if (loading) {
    return (
      <div className="flex text-center mx-auto justify-center items-center py-10">
        <BallTriangle
          height="30"
          width="30"
          color="purple"
          ariaLabel="loading"
        />
      </div>
    );
  } else if (!nfts.length) {
    return (
      <h2 className="flex text-center m-auto justify-center font-bold text-xl items-center py-10 capitalize">
        No nft item listed yet
      </h2>
    );
  }

  const transferToken = async (nft) => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);

    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const tx = await marketContract.buyNftFromMarket(
      ERC20_TOKEN,
      nft.tokenId,
      NFT_ADDRESS
    );

    await tx.wait();
    setProcessing(false);
    getNFTS();
  };

  return (
    <div className="grid grid-cols-4 gap-5 my-5 px-5">
      {nfts.map((item) => (
        <SingleGridView
          key={item.tokenId}
          nft={item}
          isBuy={true}
          buyNFT={transferToken}
          processing={processing}
        />
      ))}
    </div>
  );
}
