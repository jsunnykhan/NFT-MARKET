import { ethers } from "ethers";
import { NFT_ADDRESS, Market_ADDRESS } from "../../config";
import NFT from "../../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import React, { useContext, useEffect, useState } from "react";
import Web3Modal from "web3modal";
import axios from "axios";
import { _getMintedNFT } from "../../utils/NFT";

import NftGridView from "../../components/NftGridView";
import { StateContext } from "../../components/StateContex";
import { useRouter } from "next/router";
import crypto from "crypto";

const Nft = () => {
  const [mintedNft, setMintedNft] = useState([]);
  const [createdNft, setCreatedNft] = useState([]);

  const { redirect, setSingleNft, singleNft } = useContext(StateContext);

  const router = useRouter();

  useEffect(() => {
    if (redirect.redirectUrl === "mint") {
      getMintedNft();
    } else if (redirect.redirectUrl === "own") {
      getNftCreated();
    } else {
      getMintedNft();
    }
  }, [redirect.redirectUrl]);

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

  const getMintedNft = async () => {
    const data = await _getMintedNFT();

    const { marketContract, nftContract } = await contractInit();

    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        let formateItem = {
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
          attributes: metaData.data.attributes,
        };

        return formateItem;
      })
    );
    setMintedNft((preState) => (preState = items));
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

  const redirectNftDetailPage = (nft) => {
    setSingleNft(nft);
    const hash = crypto
      .createHash("sha256")
      .update(nft.name + nft.tokenId + nft.seller + "/nft")
      .digest("hex");

    router.push(router.route + "/" + hash);
  };

  if (!createdNft.length && !mintedNft.length) {
    return (
      <h3 className="m-auto justify-center items-center text-center py-20">
        You does not have any NFT !!
      </h3>
    );
  }
  return (
    <div className="my-10 px-10">
      {redirect.redirectUrl === "mint" ? (
        <NftGridView
          nftList={mintedNft}
          notFoundMessage="You haven't any NFT"
          redirectNftDetailPage={redirectNftDetailPage}
        />
      ) : (
        <NftGridView
          nftList={createdNft}
          notFoundMessage="No NFT found that you created"
          redirectNftDetailPage={redirectNftDetailPage}
        />
      )}
    </div>
  );
};

export default Nft;
