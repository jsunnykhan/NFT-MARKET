import SingleGridView from "../components/SingleGridView";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import axios from "axios";
import Web3Modal from "web3modal";

import { NFT_ADDRESS, Market_ADDRESS, ERC20_TOKEN } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import Token from "../artifacts/contracts/MyToken.sol/MyToken.json";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    getNFTS();
  }, []);

  const getNFTS = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      // "https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac"
      "http://127.0.0.1:7545"
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
    console.log(nft);
    const web3modal = new Web3Modal();
    setProcessing(true);
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    const signer = provider.getSigner();
    
    const contract = new ethers.Contract(Market_ADDRESS, Market.abi, signer);
    console.log(contract)
    try {
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      console.log(price)

      const tx = await contract.createMarketSale(NFT_ADDRESS, nft.tokenId , {value : price});
      console.log("4");
      await tx.wait();
      setProcessing(false);
      getNFTS();
      console.log("3");
    } catch (error) {
      setProcessing(false);
    }
  };

  if (!nfts.length) {
    return <h3>No NFT Listed yet !!</h3>;
  }

  const transferToken = async () => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);

    const signer = provider.getSigner();
    const erc20Token = new ethers.Contract(ERC20_TOKEN, Token.abi, signer);

    console.log(erc20Token);

    await erc20Token.transfer(Market_ADDRESS, 10000000000000000000n);
  };

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
