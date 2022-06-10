import SingleGridView from "../components/SingleGridView";
import { ethers } from "ethers";
import { NFT_ADDRESS, Market_ADDRESS } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import React, { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import axios from "axios";

const Nft = () => {
  const [myNft, setMyNft] = useState([]);
  const [createdNft, setCreatedNft] = useState([]);

  useEffect(() => {
    getMyNFTS();
    getNftCreated();
  }, []);

  const contractInit = async () => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);

    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );

    return { marketContract, nftContract };
  };
  const getMyNFTS = async () => {
    const { marketContract, nftContract } = await contractInit();

    const data = await marketContract.fetchMyNft();
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
    setMyNft((preState) => (preState = items));
  };

  const getNftCreated = async () => {
    const { marketContract, nftContract } = await contractInit();

    const data = await marketContract.fetchItemsCreated();
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
    setCreatedNft((preState) => (preState = items));
  };

  if (!myNft.length) {
    return <h3>You does not have any NFT !!</h3>;
  }

  console.log({ createdNft });

  return (
    <div className=" my-5 px-5">
      <h3 className="px-2 font-bold text-2xl py-5">My NFT</h3>

      {!myNft.length ? (
        <p className="flex text-center mx-auto justify-center">{`You haven't any NFT`}</p>
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {myNft.map((item) => (
            <SingleGridView
              key={item.tokenId}
              nft={item}
              isBuy={false}
              processing={false}
              buyNFT={() => {}}
            />
          ))}
        </div>
      )}

      <h3 className="px-2 font-bold text-2xl mt-5 py-5">Created NFT</h3>
      {!createdNft.length ? (
        <p className="flex text-center mx-auto justify-center">{`No NFT found that you created`}</p>
      ) : (
        <div className="grid grid-cols-4 gap-5">
          {createdNft.map((item) => (
            <SingleGridView
              key={item.tokenId}
              nft={item}
              isBuy={false}
              processing={false}
              buyNFT={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Nft;
