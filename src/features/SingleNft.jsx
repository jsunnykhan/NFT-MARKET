import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import moment from 'moment';
import SellModal from '../components/sellModal';
import AuctionModal from '../components/AuctionModal';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { VscListSelection } from 'react-icons/vsc';
import { MdOutlineBookmark } from 'react-icons/md';
import { _getSingleNft, _listingToMarket } from '../helper/collection.ts';
import { _getCreator } from '../helper/events/getCreator';
import { _startAuction } from '../helper/auction.ts';
import { toMiliseonds } from '../helper/convertTime.ts';
import { useRouter } from 'next/router';
import { ERC20_TOKEN } from '../helper/contractImport.ts';
import { _getTransferEvents } from '../helper/events/transferEvent';
import {
  _getListedItemStatus,
  _getNftPrice,
  _buyNft,
} from '../helper/market.ts';

const SingleNFT = () => {
  const [isDesOpen, setIsDesOpen] = useState(true);
  const [isProOpen, setIsProOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [singleNft, setSingleNft] = useState({});
  const [image, setImage] = useState();
  const [tokenId, setTokenId] = useState('');
  const [history, setHistory] = useState([]);
  const [collectionAddress, setCollectionAddress] = useState('');
  const [listingStatus, setListingStatus] = useState(false);
  const [listingId, setListingId] = useState('');
  const [isAuctionModalOpen, setIsAuctionModalOpen] = useState(false);
  const [basePrice, setBasePrice] = useState('');
  const [auctionTime, setAuctionTime] = useState('');
  const [listedPrice, setListedPrice] = useState('');

  const router = useRouter();

  const listingItemIntoMarket = async () => {
    if (singleNft.tokenId) {
      const listingMarket = await _listingToMarket(
        singleNft.tokenId,
        price,
        singleNft.collectionAddress
      );
      setPrice('');
      console.log(listingMarket);
      router.push('/');
      setIsSellModalOpen(false);
    }
  };

  const auctionItemsIntoMarket = async () => {
    console.log(auctionTime);
    const duration = Math.ceil((toMiliseonds(auctionTime) - Date.now()) / 1000);
    console.log(duration);
    await _startAuction(
      singleNft.collectionAddress,
      singleNft.tokenId,
      singleNft.creator,
      duration,
      basePrice
    );
    const currentTime = moment().format('YYYY-MM-DDTHH:mm:ss');
    console.log(currentTime.toString());
    const durationInHour = Math.ceil(duration / 3600);
    const response = await axios.post(
      'http://159.89.3.212:8860/api/v1/auction',
      {
        auction_id: singleNft.tokenId,
        token_address: ERC20_TOKEN,
        nft_contract: singleNft.collectionAddress,
        auction_created_time: currentTime,
        auction_start_time: currentTime,
        duration: durationInHour,
      }
    );
    console.log(response);
    setIsAuctionModalOpen(false);
  };

  const buyNft = async () => {
    await _buyNft(listingId, collectionAddress, listedPrice);
    router.push('/collectors');
  };

  const extractDetail = (addressToken) => {
    const collectionAddress = addressToken.slice(0, 42);
    console.log(collectionAddress);
    const tokenId = addressToken.slice(43, addressToken.length);
    console.log(tokenId);
    const quearyString = window.location.search;
    console.log(typeof quearyString);
    let listingId;
    if (quearyString) {
      const param = new URLSearchParams(quearyString);
      console.log(param.get('id'));
      listingId = param.get('id');
    }
    return { tokenId, collectionAddress, listingId };
  };

  const sellModalOpen = () => {
    setIsSellModalOpen(true);
  };

  const auctionModalOpen = () => {
    setIsAuctionModalOpen(true);
  };

  const getNftDetails = async (collectionAddress, tokenId) => {
    const singleNft = await _getSingleNft(tokenId, collectionAddress);
    const creator = await _getCreator(collectionAddress, tokenId);
    const tempNft = {
      tokenId: tokenId,
      collectionAddress: collectionAddress,
      image: singleNft.imageUrl,
      owner: singleNft.owner,
      name: singleNft.name,
      creator,
      description: singleNft.description,
      properties: singleNft.properties,
    };
    setImage(singleNft.imageUrl);
    setSingleNft(tempNft);
  };

  const getHistory = async (collectionAddress, tokenId) => {
    const transferEvents = await _getTransferEvents(collectionAddress, tokenId);
    console.log(transferEvents);
    setHistory(transferEvents);
  };

  const isListed = async (listingId) => {
    const islisted = await _getListedItemStatus(listingId);
    setListingStatus(islisted);
    if (islisted) {
      const price = await _getNftPrice(listingId);
      setListedPrice(price);
    }
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    const addressToken = window.location.pathname.split('/').pop();
    console.log(addressToken);
    const { tokenId, collectionAddress, listingId } =
      extractDetail(addressToken);
    if (listingId) {
      setListingId(listingId);
      isListed(listingId);
      setCollectionAddress(collectionAddress);
      setTokenId(tokenId);
      getNftDetails(collectionAddress, tokenId);
      getHistory(collectionAddress, tokenId);
    }
    setCollectionAddress(collectionAddress);
    setTokenId(tokenId);
    getNftDetails(collectionAddress, tokenId);
    getHistory(collectionAddress, tokenId);
  }, []);

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
                // src={singleNft?.image}
                src={
                  image === undefined
                    ? 'https://nftstorage.link/ipfs/bafybeiazxj5ftmh526gxjn3rowrnl5mrjflg3sxbqk32od4fc6lnk3ct4q/wallpaperflare.com_wallpaper (4).jpg'
                    : image
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
              <p className="font-medium">Owned by</p>
              <p className="text-blue-600 w-20">{singleNft.owner}</p>
            </div>
            <div className="flex space-x-3">
              <h3 className="font-semibold capitalize text-4xl">
                {singleNft.name}
              </h3>
              <h3 className="font-semibold capitalize text-4xl">
                {'#' + tokenId}
              </h3>
            </div>
            <div className="flex space-x-2">
              <p className="font-medium">Created by</p>
              <p className="text-blue-600 w-20">{singleNft.creator}</p>
            </div>
            {!listingStatus ? (
              <div className="flex justify-start">
                <button
                  className="w-[20%] bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg"
                  onClick={sellModalOpen}
                >
                  Sell
                </button>
                <button
                  className="w-[20%] bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg mx-2"
                  onClick={auctionModalOpen}
                >
                  Auction
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-start">
                  <div>Price: {listedPrice} VSC</div>
                </div>
                <div className="flex justify-start">
                  <button
                    className="w-[20%] bg-blue-600 text-white text-lg font-semibold py-3 rounded-lg"
                    onClick={buyNft}
                  >
                    Buy
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="h-max shadow-lg px-5 py-5 space-y-5 ring-1 ring-purple-100 rounded">
            <div className="flex space-x-3">
              <h2 className="font-semibold capitalize text-2xl">NFT History</h2>
            </div>
            {history.length !== 0 ? (
              <ul>
                {history.map((event) => {
                  return (
                    <li key={event.transactionHash}>
                      <span className="truncate">
                        {event.returnValues.from}
                      </span>{' '}
                      to{' '}
                      <span className="truncate">{event.returnValues.to}</span>
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

export default SingleNFT;
