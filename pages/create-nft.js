import React from "react";
import { useState } from "react";
import { ethers } from "ethers";

import { create as ipfsHttpClient } from "ipfs-http-client";
import Web3Modal from "web3modal";
import { NFT_ADDRESS, Market_ADDRESS } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useRouter } from "next/router";
import Image from "next/image";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

const CreateNFT = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const [mint, setMint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formInput, setFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  const router = useRouter();

  const onChange = async (event) => {
    const file = event.target.files[0];
    try {
      const data = await client.add(file, {
        progress: (progress) => console.log({ process }),
      });
      console.log({ data });
      const url = `https://ipfs.infura.io/ipfs/${data.path}`;

      setFileUrl((preState) => (preState = url));
    } catch (error) {
      console.error(error);
    }
  };

  const creatingNftMetaData = async () => {
    const { name, price, description } = formInput;
    if (!name || !price || !description || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    try {
      const nftData = await client.add(data);
      console.log({ nftData });
      const url = `https://ipfs.infura.io/ipfs/${nftData.path}`;

      createNFT(url);
    } catch (error) {
      console.error(error);
    }
  };

  const createNFT = async (url) => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    const signer = provider.getSigner();

    setMint(true);
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);
    let transaction = await nftContract.createNewToken(url);
    let tx = await transaction.wait();

    setMint(false);
    setSubmitted(true);
    const event = tx.events[0];
    const value = event.args.tokenId;
    const tokenId = value.toString();

    const price = ethers.utils.parseUnits(formInput.price, "ether");
    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );

    let listingPrice = await marketContract.getMarketListingPrice();
    listingPrice = listingPrice.toString();

    transaction = await marketContract.createMarketItem(
      NFT_ADDRESS,
      tokenId,
      price,
      { value: listingPrice }
    );
    tx = await transaction.wait();
    setSubmitted(false);
    router.push("/");
  };

  return (
    <div className="w-full ">
      <div className="flex mx-auto justify-center my-5">
        <div className="flex flex-col space-y-5 w-2/5">
          <input
            type="text"
            className="ring-0 bg-gray-300 px-2 py-2 rounded w-80"
            placeholder="NFT Name"
            onChange={(event) =>
              setFormInput((preState) => ({
                ...preState,
                name: event.target.value,
              }))
            }
          />

          <input
            type="text"
            className="ring-0 bg-gray-300 px-2 py-2 rounded w-80"
            placeholder="NFT Description"
            onChange={(event) =>
              setFormInput((preState) => ({
                ...preState,
                description: event.target.value,
              }))
            }
          />
          <input
            type="text"
            className="ring-0 bg-gray-300 px-2 py-2 rounded w-80"
            placeholder="NFT Price"
            onChange={(event) =>
              setFormInput((preState) => ({
                ...preState,
                price: event.target.value,
              }))
            }
          />
          <input type="file" name="nft-file" onChange={onChange} />
          {fileUrl && (
            <Image src={fileUrl} width={100} height={100} alt="file" />
          )}
          <button
            className="bg-purple-500 py-2 rounded text-white font-bold"
            onClick={creatingNftMetaData}
          >
            {mint ? "Minting ...." : submitted ? "Listing ...." : "Create NFT"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNFT;
