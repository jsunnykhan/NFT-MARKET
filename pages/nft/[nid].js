import React, { useContext, useState } from "react";
import Image from "next/image";

import { StateContext } from "../../components/StateContex";

import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { VscListSelection } from "react-icons/vsc";
import { MdOutlineBookmark } from "react-icons/md";
import SellModal from "../../components/sellModal";
import { _listingToMarket } from "../../utils/NFT";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";

const NFTDetail = () => {
  const [isDesOpen, setIsDesOpen] = useState(true);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [price, setPrice] = useState("");

  const { singleNft } = useContext(StateContext);

  const router = useRouter();

  const listingItemIntoMarket = async () => {
    setIsSellModalOpen(false);
    
    if (singleNft.tokenId) {
      const listingMarket = await _listingToMarket(singleNft.tokenId, price);
      setPrice("");
      console.log(listingMarket);
      router.push('/');
    }
  };

  const sellModalOpen = () => {
    setIsSellModalOpen(true);
  };

  return (
    <div className="w-full h-screen relative">
      {isSellModalOpen && (
        <SellModal
          price={price}
          setPrice={setPrice}
          listingItemIntoMarket={listingItemIntoMarket}
          isSellModalOpen={isSellModalOpen}
          setIsSellModalOpen={setIsSellModalOpen}
        />
      )}
      <div className="w-full px-10 py-10 flex h-screen justify-between space-x-5">
        <div className="w-[30%] space-y-5">
          <div className=" h-3/5 shadow-lg rounded-md ring-1 ring-purple-100">
            <div className="relative w-full h-[90%] rounded-t-md overflow-hidden">
              <Image
                src={singleNft?.image}
                alt={singleNft.name}
                layout="fill"
                objectFit="cover"
                priority="true"
              />
            </div>
          </div>

          <div className="h-max rounded-md shadow-lg">
            <div
              className="h-16 px-10 flex items-center justify-between ring-1 ring-purple-100 shadow-lg"
              onClick={() => setIsDesOpen((pre) => (pre = !pre))}
            >
              <div className="flex items-center space-x-3">
                <VscListSelection />
                <h4 className="font-semibold text-xl">Description</h4>
              </div>
              {isDesOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {isDesOpen && (
              <div className="bg-gray-300 bg-opacity-25 px-6 py-1 max-h-40 overflow-y-scroll">
                <p>{singleNft.description}</p>
              </div>
            )}
            <div
              className="h-16 px-10 flex items-center justify-between ring-1 ring-purple-100 shadow-lg"
              onClick={() => setIsProOpen((pre) => (pre = !pre))}
            >
              <div className="flex items-center space-x-3">
                <MdOutlineBookmark size={20} />
                <h4 className="font-semibold text-xl">Properties</h4>
              </div>
              {isProOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
            {isProOpen && (
              <div className="bg-gray-300 bg-opacity-25 px-3 h-max grid gap-x-5 gap-y-4 py-5 overflow-x-hidden">
                {singleNft?.attributes?.map((data, index) => (
                  <div
                    key={index}
                    className="px-10 py-2 shadow-xl rounded-md bg-blue-100 w-max flex flex-col ring-1 ring-purple-200 justify-center mx-auto items-center "
                  >
                    <h3 className="text-lg font-medium capitalize">
                      {data.trait_type}
                    </h3>
                    <p className="text-md font-normal capitalize">
                      {data.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="w-[70%] ml-2">
          <div className="h-max shadow-lg px-5 py-5 space-y-5 ring-1 ring-purple-100 rounded">
            <div className="flex space-x-2">
              <p className="font-medium">Created by</p>
              <p className="text-blue-600 truncate w-20">{singleNft.seller}</p>
            </div>
            <div className="flex space-x-3">
              <h3 className="font-semibold capitalize text-4xl">
                {singleNft.name}
              </h3>
              <h3 className="font-semibold capitalize text-4xl">
                {"#" + singleNft.tokenId}
              </h3>
            </div>
            <div className="flex space-x-2">
              <p className="font-medium">Owned by</p>
              <p className="text-blue-600 truncate w-20">{singleNft.owner}</p>
            </div>
            <div>
              <button
                className="w-[20%] bg-blue-600 text-white text-2xl font-semibold py-3 rounded-lg"
                onClick={sellModalOpen}
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
