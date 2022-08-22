import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import Collection from "../../artifacts/contracts/market/Collection.sol/Collection.json";
import { Market_ADDRESS } from "../helper/contractImport.ts";

const MakeCollectionModal = (props) => {
  const { isCollectionModalOpen, setIsCollectionModalOpen } = props;

  const [valid, setValid] = useState(true);
  const [formInput, setFormInput] = useState({
    collection: "",
    symbol: "",
  });

  const handleContractCreation = async () => {
    const { collection, symbol } = formInput;
    if (!collection || !symbol) return;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const Nft = new ethers.ContractFactory(
      Collection.abi,
      Collection.bytecode,
      signer
    );
    const nft = await Nft.deploy(
      formInput.collection,
      formInput.symbol,
      Market_ADDRESS
    );
    await nft.deployTransaction.wait();
    const nftAddress = nft.address;
    setIsCollectionModalOpen(false);
  };

  useEffect(() => {
    if (!isCollectionModalOpen) {
      console.log(true);
      return () => true;
    }
  }, [isCollectionModalOpen]);

  return (
    <div className="absolute top-0 left-0 right-0 bottom-0 z-30 w-full h-full bg-black bg-opacity-60 min-w-full min-h-screen text-primary">
      <div className="relative w-max h-max mt-40 m-auto items-center bg-white ring-1 ring-purple-100 rounded p-5 mb-3">
        <p
          className="absolute top-0 right-3 font-bold cursor-pointer p-2"
          onClick={() => setIsCollectionModalOpen(false)}
        >
          x
        </p>
        <h3 className="font-semibold text-xl text-gray-700">
          Create New Collection
        </h3>
        <div className="grid gap-4 grid-cols-2 grid-rows-1 mt-4">
          <input
            type="text"
            required
            className="ring-1 ring-gray-300  bg-none  px-3 py-3 rounded w-full transition-all duration-300 hover:shadow-md outline-none focus:ring-gray-400"
            placeholder="Collection Name"
            onChange={(event) =>
              setFormInput((preState) => ({
                ...preState,
                collection: event.target.value,
              }))
            }
          />
          <input
            type="text"
            required
            className="ring-1 ring-gray-300  bg-none  px-3 py-3 rounded w-full transition-all duration-300 hover:shadow-md outline-none focus:ring-gray-400"
            placeholder="Collection Symbol"
            onChange={(event) =>
              setFormInput((preState) => ({
                ...preState,
                symbol: event.target.value,
              }))
            }
          />
        </div>
        <button
          className="w-1/2 bg-blue-600 text-white text-xl font-semibold py-2.5 rounded-lg mt-10 disabled:bg-blue-200"
          // disabled={valid}
          onClick={handleContractCreation}
        >
          Create Collection
        </button>
      </div>
    </div>
  );
};

export default MakeCollectionModal;
