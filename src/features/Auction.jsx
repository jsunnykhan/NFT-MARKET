import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { VscListSelection } from 'react-icons/vsc';
import { MdOutlineBookmark } from 'react-icons/md';
import { _bid } from '../helper/auction.ts';
import CountdownTimer from '../components/timer/CountdownTimer';
import BidModal from '../components/BidModal';
import { _getSingleAuctionItem } from '../helper/auction.ts';
import { _getSingleNft } from '../helper/collection.ts';
import { ethers } from 'ethers';
import { _getBidEvents } from '../helper/events/getBidEvent';

const Auction = () => {
  const [isDesOpen, setIsDesOpen] = useState(true);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isBidModalOpen, setIsBidModalOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [auctionId, setAucitonId] = useState('');
  const [auctionTime, setAuctionTime] = useState(undefined);
  const [singleNft, setSingleNft] = useState({});
  const [bidEvents, setBidEvents] = useState([]);
  const [highestBid, setHIghestBid] = useState({
    returnValues: {
      bid: '0',
    },
  });

  const auctionModalOpen = () => {
    setIsBidModalOpen(true);
  };

  const bid = async () => {
    console.log(auctionId, price);
    await _bid(auctionId, price);
    const events = await _getBidEvents();
    setBidEvents(events);
    // if (events.length !== 0) {
    //   setHIghestBid(events[events.length - 1].returnValues);
    // }
    setIsBidModalOpen(false);
  };

  const extractDetail = (addressToken) => {
    const collectionAddress = addressToken.slice(0, 42);
    const auctionId = addressToken.slice(43, addressToken.length);
    return { auctionId, collectionAddress };
  };

  const getAuctionDetails = async () => {
    const addressToken = window.location.pathname.split('/').pop();
    console.log(addressToken);
    const { auctionId, collectionAddress } = extractDetail(addressToken);
    console.log(auctionId);
    const auctionItem = await _getSingleAuctionItem(auctionId);
    console.log(auctionItem);
    const singleNft = await _getSingleNft(
      auctionItem.tokenId,
      collectionAddress
    );
    const events = await _getBidEvents(auctionId);
    setBidEvents(events);
    // setHIghestBid(events[events.length - 1]);
    setAucitonId(auctionId);
    const tID = auctionItem.tokenId.toString();
    const bValue = ethers.utils.formatUnits(
      auctionItem.baseValue.toString(),
      'ether'
    );
    const tempNft = {
      auctionId: auctionId,
      tokenId: tID,
      collectionAddress: collectionAddress,
      image: singleNft.imageUrl,
      owner: singleNft.owner,
      name: singleNft.name,
      baseValue: bValue,
      creator: auctionItem.creator,
      description: singleNft.description,
      properties: singleNft.properties,
    };
    console.log(tempNft);
    const endTime = Number(auctionItem.auctionEndTime);
    setAuctionTime(endTime * 1000);
    setSingleNft(tempNft);
  };

  console.log(bidEvents);

  useEffect(() => {
    getAuctionDetails();
  }, []);

  console.log(singleNft.image);

  return (
    <div className="w-full h-screen relative">
      {isBidModalOpen && (
        <BidModal
          price={price}
          setPrice={setPrice}
          bid={bid}
          isBidModalOpen={isBidModalOpen}
          setAuctionTime={setAuctionTime}
          setIsBidModalOpen={setIsBidModalOpen}
        />
      )}
      <div className="w-full px-10 py-10 flex h-screen justify-between space-x-5">
        <div className="w-[30%] space-y-5">
          <div className=" h-3/5 shadow-lg rounded-md ring-1 ring-purple-100">
            <div className="relative w-full h-[90%] rounded-t-md overflow-hidden">
              <Image
                src={
                  singleNft.image === undefined
                    ? 'https://nftstorage.link/ipfs/bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg'
                    : singleNft.image
                }
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
                {singleNft?.properties?.map((data, index) => (
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
          <div className="h-max shadow-lg px-5 py-5 mb-4 space-y-5 ring-1 ring-purple-100 rounded">
            <div className="flex space-x-2">
              <p className="font-medium">Created by</p>
              <p className="text-blue-600 w-40">{singleNft.creator}</p>
            </div>
            <div className="flex space-x-3">
              <h3 className="font-semibold capitalize text-4xl">
                {singleNft.name}
              </h3>
              <h3 className="font-semibold capitalize text-4xl">
                {'#' + singleNft.tokenId}
              </h3>
            </div>
            <div>
              <CountdownTimer targetDate={auctionTime} />
            </div>
            <div className="flex space-x-2">
              <p className="font-medium">Base price: </p>
              <p className="text-blue-600 w-20">{singleNft.baseValue} VSC</p>
            </div>
            {/* <div className="flex space-x-2">
              {bidEvents.length !== 0 ? (
                <>
                  <p className="font-medium">Current Highest Bid: </p>
                  <p className="text-blue-600 truncate w-20">
                    {ethers.utils.formatUnits(highestBid.bid.toString())} VSC
                  </p>
                </>
              ) : (
                ''
              )}
            </div> */}
            <div className="flex justify-start">
              <button
                className="w-[20%] bg-blue-600 text-white text-2xl font-semibold py-3 rounded-lg mx-2"
                onClick={auctionModalOpen}
              >
                Bid
              </button>
            </div>
          </div>
          <div className="h-max shadow-lg px-5 py-5 space-y-5 ring-1 ring-purple-100 rounded">
            <div className="flex space-x-3">
              <h2 className="font-semibold capitalize text-2xl">Bid History</h2>
            </div>
            {bidEvents.length !== 0 ? (
              <ul>
                {bidEvents.map((event) => {
                  return (
                    <li key={event.transactionHash}>
                      {event.returnValues.bidder} bid{' '}
                      {ethers.utils.formatUnits(event.returnValues.bid)}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No bids</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auction;
