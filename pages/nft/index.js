import { ethers } from 'ethers';
import { NFT_ADDRESS, Market_ADDRESS } from '../../config';
import NFT from '../../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import React, { useContext, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import axios from 'axios';
import { _getAuctionItems, _getMintedNFT } from '../../utils/NFT';

import NftGridView from '../../components/NftGridView';
import { StateContext } from '../../components/StateContex';
import { useRouter } from 'next/router';
import crypto from 'crypto';

const Nft = () => {
  const [mintedNft, setMintedNft] = useState([]);
  const [createdNft, setCreatedNft] = useState([]);
  const [ownedNft, setOwnedNft] = useState([]);
  const [auctionNft, setAuctionNft] = useState([]);
  const [tabHandle, setTabHandler] = useState('mint');

  const { setSingleNft } = useContext(StateContext);

  const router = useRouter();

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    getMintedNft();
    getNftCreated();
    getOwnedItems();
    getAuctionNft();
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

  const getMintedNft = async () => {
    const data = await _getMintedNFT();

    const { marketContract, nftContract } = await contractInit();

    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        let formateItem = {
          itemId: item.itemId.toString(),
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
    console.log(items);
    setMintedNft((preState) => (preState = items));
  };

  const getNftCreated = async () => {
    const { marketContract, nftContract } = await contractInit();

    const data = await marketContract.fetchItemsCreated();
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(item.price.toString(), 'ether');
        let formateItem = {
          itemId: item.itemId.toString(),
          price,
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
    console.log(items);
    setCreatedNft((preState) => (preState = items));
  };

  const getOwnedItems = async () => {
    const { marketContract, nftContract } = await contractInit();

    const data = await marketContract.fetchMyNft();
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(item.price.toString(), 'ether');
        let formateItem = {
          itemId: item.itemId.toString(),
          price,
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
    console.log(items);
    setOwnedNft((preState) => (preState = items));
  };

  const getAuctionNft = async () => {
    const { marketContract, nftContract } = await contractInit();

    const data = await _getAuctionItems();
    console.log(data);
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(
          item.baseValue.toString(),
          'ether'
        );
        let formateItem = {
          itemId: item.itemId.toString(),
          auctionId: Number(item.id),
          price,
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
          attributes: metaData.data.attributes,
          auctionEndTime: item.auctionEndTime,
          highestBid: ethers.utils.formatUnits(
            item.highestBid.toString(),
            'ether'
          ),
          highestBidder: item.highestBidder.toString(),
        };

        return formateItem;
      })
    );
    setAuctionNft((preState) => (preState = items));
    console.log(items);
  };

  const redirectNftDetailPage = (nft) => {
    setSingleNft(nft);
    const hash = crypto
      .createHash('sha256')
      .update(nft.name + nft.tokenId + nft.seller + '/nft')
      .digest('hex');

    console.log(router.route);

    router.push(router.route + '/' + hash);
  };

  const redirectAuctionPage = (nft) => {
    console.log(nft);
    setSingleNft(nft);
    const hash = crypto
      .createHash('sha256')
      .update(nft.name + nft.tokenId + nft.seller + '/auction')
      .digest('hex');
    console.log(router.route);

    router.push('auction/' + hash);
  };

  if (!createdNft.length && !mintedNft.length && !ownedNft.length) {
    return (
      <h3 className="m-auto justify-center items-center text-center py-20">
        You do not have any NFT !!
      </h3>
    );
  }

  const tabChangeHandler = (tab) => {
    setTabHandler(tab);
  };

  return (
    <div className="my-10 px-10">
      <div className="flex space-x-5 pb-10">
        <h2
          className={`bg-gray-100 ${
            tabHandle === 'mint' ? 'bg-blue-500 text-white' : 'text-black'
          } px-5 py-2 rounded-full font-bold cursor-pointer`}
          onClick={() => tabChangeHandler('mint')}
        >
          Minted Items
        </h2>
        <h2
          className={`bg-gray-100  ${
            tabHandle === 'created' ? 'bg-blue-500 text-white' : 'text-black'
          } px-5 py-2 rounded-full font-bold cursor-pointer`}
          onClick={() => tabChangeHandler('created')}
        >
          Selling Items
        </h2>
        <h2
          className={`bg-gray-100 ${
            tabHandle === 'owned' ? 'bg-blue-500 text-white' : 'text-black'
          }  px-5 py-2 rounded-full font-bold cursor-pointer`}
          onClick={() => tabChangeHandler('owned')}
        >
          Owned Items
        </h2>
        <h2
          className={`bg-gray-100 ${
            tabHandle === 'auction' ? 'bg-blue-500 text-white' : 'text-black'
          }  px-5 py-2 rounded-full font-bold cursor-pointer`}
          onClick={() => tabChangeHandler('auction')}
        >
          Auction Items
        </h2>
      </div>
      {tabHandle === 'mint' ? (
        <NftGridView
          nftList={mintedNft}
          notFoundMessage="You never mint any NFT"
          redirectNftDetailPage={redirectNftDetailPage}
        />
      ) : tabHandle === 'created' ? (
        <NftGridView
          nftList={createdNft}
          notFoundMessage="No NFT found that you Sell on Dark Sea"
          redirectNftDetailPage={redirectNftDetailPage}
        />
      ) : tabHandle === 'owned' ? (
        <NftGridView
          nftList={ownedNft}
          notFoundMessage="No NFT found that you owned"
          redirectNftDetailPage={redirectNftDetailPage}
        />
      ) : (
        <NftGridView
          nftList={auctionNft}
          notFoundMessage="No NFT currently at auction"
          redirectNftDetailPage={redirectAuctionPage}
        />
      )}
    </div>
  );
};

export default Nft;
