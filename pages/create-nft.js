import React from "react";
import { useState } from "react";

import { create as ipfsHttpClient } from "ipfs-http-client";

import { useRouter } from "next/router";
import Image from "next/image";
import { _uploadFile, _uploadMetaData } from "../utils/fileUpload";
import { _listingToMarket, _minting } from "../utils/NFT";

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
    const fileUrl = await _uploadFile(file);
    setFileUrl((preState) => (preState = fileUrl));
  };

  const creatingNftMetaData = async () => {
    const { name, price, description } = formInput;
    if (!name || !price || !description || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });

    const metaDataUrl = await _uploadMetaData(data);
   

    const tokenId = await _minting(metaDataUrl);

    const listingMarket = await _listingToMarket(tokenId, price);

    console.log(listingMarket)

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
