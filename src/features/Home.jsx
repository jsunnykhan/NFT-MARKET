import SingleGridView from "../components/SingleGridView";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";

import axios from "axios";

import {
  _getMarketContract,
  _getCollectionContract,
} from "../helper/contracts.ts";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const market = _getMarketContract();
    let listOfItem;
    try {
      const data = await market.listingItems();
      listOfItem = await Promise.all(
        data.map(async (item) => {
          const address = item.collectionAddress;
          const tokenUri = await _getCollectionContract(address).tokenURI(
            item.tokenId
          );
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            "ether"
          );
          const metaData = await axios.get(tokenUri);
          let formateItem = {
            price,
            tokenId: item.tokenId.toString(),
            creator: item.creator,
            owner: item.owner,
            collection: address,
            image: metaData.data.image,
            name: metaData.data.name,
            description: metaData.data.description,
          };
          return formateItem;
        })
      );
      setNfts((pre) => (pre = listOfItem));
    } catch (error) {
      console.log(error);
    }

    // const data = await marketContract.fetchMarketItems();
    // const items = await Promise.all(
    //   data.map(async (item) => {
    //     const tokenUri = await nftContract.tokenURI(item.tokenId);
    //     const metaData = await axios.get(tokenUri);
    //     const price = ethers.utils.formatUnits(item.price.toString(), "ether");
    //     let formateItem = {
    //       price,
    //       tokenId: item.tokenId.toString(),
    //       seller: item.seller,
    //       owner: item.owner,
    //       image: metaData.data.image,
    //       name: metaData.data.name,
    //       description: metaData.data.description,
    //     };
    //     return formateItem;
    //   })
    // );
    // setNfts((preState) => (preState = items));
  };

  const buyNFT = async (nft) => {
    console.log(nft);
    const web3modal = new Web3Modal();
    setProcessing(true);
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );

    const vsContract = new ethers.Contract(ERC20_TOKEN, Token.abi, signer);
    console.log(marketContract, vsContract);
    try {
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      console.log(price);

      const tx = await marketContract.createMarketSale(
        NFT_ADDRESS,
        nft.tokenId,
        { value: price }
      );
      console.log("4");
      await tx.wait();
      setProcessing(false);
      getNFTS();
      console.log("3");
    } catch (error) {
      setProcessing(false);
    }
  };

  const transferToken = async (nft) => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);

    const signer = provider.getSigner();
    const erc20Token = new ethers.Contract(ERC20_TOKEN, Token.abi, signer);

    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );

    console.log(erc20Token);
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

    // const tx = await erc20Token.approve(Market_ADDRESS, price);
    // await tx.wait();

    const walletAddress = await signer.getAddress();

    const tx = await marketContract.buyNftFromMarket(
      ERC20_TOKEN,
      nft.tokenId,
      NFT_ADDRESS
    );

    await tx.wait();
    setProcessing(false);
    getNFTS();

    // const allowance = await erc20Token.allowance(walletAddress, Market_ADDRESS);
    // const balance = await erc20Token.balanceOf(Market_ADDRESS);
    // console.log( allowance.toString() , balance.toString());

    // if (allowance.toString() === price.toString()) {
    //   console.log("ssdasda");
    //   const tx = await marketContract.buyNftFromMarket(
    //     ERC20_TOKEN,
    //     nft.tokenId,
    //     NFT_ADDRESS
    //   );
    //   console.log("4");
    //   await tx.wait();
    //   setProcessing(false);
    //   getNFTS();
    //   console.log("3");
    // } else {
    //   console.log("Transaction failed");
    // }

    // //   provider.on("block", (blockNumber) => {
    // //     console.log(blockNumber)
    // // })
    // provider.on("DebugLog", (message, price) => {
    //   console.log(message, price);
    // });
  };

  return (
    <div className="h-full flex flex-col w-full">
      <Dashboard />
      <div className="grid grid-cols-4 gap-5 my-5 px-5 ">
        {nfts.length ? (
          nfts.map((item) => (
            <SingleGridView
              key={item.tokenId}
              nft={item}
              isBuy={true}
              buyNFT={transferToken}
              processing={processing}
            />
          ))
        ) : (
          <div>Loading ..</div>
        )}
      </div>
    </div>
  );
}
