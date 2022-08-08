import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';

import { StateContext } from '../../components/StateContex';

import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { VscListSelection } from 'react-icons/vsc';
import { MdOutlineBookmark } from 'react-icons/md';
import SellModal from '../../components/sellModal';
import { _listingToMarket, _startAuction } from '../../utils/NFT';
import { useRouter } from 'next/router';
import AuctionModal from '../../components/AuctionModal';
import { toMiliseonds } from '../../utils/toMiliseconds';
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import { NFT_ADDRESS } from '../../config';
import { Market_ADDRESS } from '../../config';

import Web3 from 'web3';

const NFTDetail = () => {
  const [isDesOpen, setIsDesOpen] = useState(true);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [auctionTime, setAuctionTime] = useState(undefined);
  const [itemCreatedEvent, setItemCreatedEvent] = useState([]);
  const [mintEvent, setMintEvent] = useState([]);
  const [transferEvents, setTransferEvents] = useState([]);

  const { singleNft } = useContext(StateContext);

  const router = useRouter();
  console.log(singleNft);

  const init = async () => {
    const web3 = new Web3(window.ethereum);
    const marketContract = new web3.eth.Contract(Market.abi, Market_ADDRESS);
    const nftContract = new web3.eth.Contract(NFT.abi, NFT_ADDRESS);
    const options1 = {
      filter: {
        seller: web3.eth.defaultAccount,
      },
      fromBlock: 0,
      toBlock: 'latest',
    };

    const options2 = {
      filter: {
        mintedBy: web3.eth.defaultAccount,
      },
      fromBlock: 0,
      toBlock: 'latest',
    };

    const transferOptions = {
      filter: {
        tokenId: singleNft.tokenId,
      },
      fromBlock: 0,
      toBlock: 'latest',
    };

    const tempTransferEvents = await nftContract.getPastEvents(
      'Transfer',
      transferOptions
    );
    setTransferEvents(tempTransferEvents);

    const tempCreatedEvents = await marketContract.getPastEvents(
      'MarketItemCreated',
      options1
    );
    const tempMintEvents = await nftContract.getPastEvents('Minted', options2);
    setItemCreatedEvent(tempCreatedEvents);
    setMintEvent(tempMintEvents);
  };

  useEffect(() => {
    init();
  }, []);

  const listingItemIntoMarket = async () => {
    setIsSellModalOpen(false);

    if (singleNft.tokenId) {
      const listingMarket = await _listingToMarket(singleNft.tokenId, price);
      setPrice('');
      console.log(listingMarket);
      router.push('/');
    }
  };

  const auctionItemsIntoMarket = async () => {
    console.log('here');
    setIsAuctionModalOpen(false);
    console.log(auctionTime);
    const remaining = Math.ceil(
      (toMiliseonds(auctionTime) - Date.now()) / 1000
    );
    await _startAuction(
      remaining,
      basePrice,
      singleNft.tokenId,
      singleNft.itemId
    );
    router.push('/');
  };

  const sellModalOpen = () => {
    setIsSellModalOpen(true);
  };

  const auctionModalOpen = () => {
    setIsAuctionModalOpen(true);
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
      {isAuctionModalOpen && (
        <AuctionModal
          basePrice={basePrice}
          setBasePrice={setBasePrice}
          auctionItemsIntoMarket={auctionItemsIntoMarket}
          isAuctionModalOpen={isAuctionModalOpen}
          setAuctionTime={setAuctionTime}
          setIsAuctionModalOpen={setIsAuctionModalOpen}
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
                {'#' + singleNft.tokenId}
              </h3>
            </div>
            <div className="flex space-x-2">
              <p className="font-medium">Owned by</p>
              <p className="text-blue-600 truncate w-20">{singleNft.owner}</p>
            </div>
            <div className="flex justify-start">
              <button
                className="w-[20%] bg-blue-600 text-white text-2xl font-semibold py-3 rounded-lg mx-2"
                onClick={sellModalOpen}
              >
                Sell
              </button>
              <button
                className="w-[20%] bg-blue-600 text-white text-2xl font-semibold py-3 rounded-lg mx-2"
                onClick={auctionModalOpen}
              >
                Auction
              </button>
            </div>
          </div>
          {/* <ul className="h-max shadow-lg px-5 py-5 space-y-5 ring-1 ring-purple-100 rounded">
            <h3>Event History</h3>
            {mintEvent.map((event) => {
              return (
                <li key={event.transactionHash}>
                  {event.returnValues.mintedBy}
                </li>
              );
            })}
          </ul> */}

          <ul className="h-max shadow-lg px-5 py-5 space-y-5 ring-1 ring-purple-100 rounded">
            {itemCreatedEvent.map((event) => {
              return (
                <li key={event.transactionHash}>{event.returnValues.seller}</li>
              );
            })}
          </ul>
          <ul className="h-max shadow-lg px-5 py-5 space-y-5 ring-1 ring-purple-100 rounded">
            {transferEvents.map((event) => {
              return (
                <li key={event.transactionHash}>
                  From: {event.returnValues.from}  To: {event.returnValues.to}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NFTDetail;
