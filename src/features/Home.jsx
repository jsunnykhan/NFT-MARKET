import SingleGridView from '../components/SingleGridView';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import { _getAllCollections } from '../helper/events.ts';
import axios from 'axios';
import {
  _getMarketContract,
  _getCollectionContract,
} from '../helper/contracts.ts';
import Dashboard from '../components/Dashboard';
import SingleCollection from '../components/SingleCollectionView';
import { _getAllAuctionItems } from '../helper/auction.ts';
import NftGridView from '../components/NftGridView';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [auctionItems, setAuctionItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    init();
    getAuctionItems();
  }, []);

  const getAuctionItems = async () => {
    const items = await _getAllAuctionItems();
    console.log(items);
    setAuctionItems(items);
  };

  const init = async () => {
    const market = _getMarketContract();
    const col = await _getAllCollections();

    const collection = col.map((item) => {
      const newItem = {
        address: item.returnValues.collectionAddress,
        name: item.returnValues.name,
        owner: item.returnValues.owner,
        symbol: item.returnValues.symbol,
      };
      return newItem;
    });
    setCollections((pre) => (pre = collection));
    let listOfItem;
    try {
      const data = await market.listingItems();

      listOfItem = await Promise.all(
        data.map(async (item) => {
          const address = item.collectionAddress;
          const tokenUri = await _getCollectionContract(address).tokenURI(
            item.tokenId
          );
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            'ether'
          );
          const listingId = item.listingId.toString();
          const metaData = await axios.get(tokenUri);
          let formateItem = {
            listingId,
            price,
            tokenId: item.tokenId.toString(),
            creator: item.creator,
            owner: item.owner,
            collectionAddress: address,
            image: metaData.data.image,
            name: metaData.data.name,
            description: metaData.data.description,
          };
          return formateItem;
        })
      );
      setNfts((pre) => (pre = listOfItem));
    } catch (error) {
      console.log(error);
    }
  };

  const redirectNFTDetailPage = (tokenId, collection) => {
    const link = `nft/${collection}:${tokenId}`;
    router.push(link);
  };

  const redirectAuctionDetailPage = (auctionId) => {
    const link = `nft/${collection}:${auctionId}`;
    router.push(link);
  };

  const buyNFT = async (nft) => {
    console.log(nft);
    const web3modal = new Web3Modal();
    setProcessing(true);
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    const signer = provider.getSigner();

    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );

    const vsContract = new ethers.Contract(ERC20_TOKEN, Token.abi, signer);
    console.log(marketContract, vsContract);
    try {
      const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');
      console.log(price);

      const tx = await marketContract.createMarketSale(
        NFT_ADDRESS,
        nft.tokenId,
        { value: price }
      );
      console.log('4');
      await tx.wait();
      setProcessing(false);
      getNFTS();
      console.log('3');
    } catch (error) {
      setProcessing(false);
    }
  };

  const transferToken = async (nft) => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);

    const signer = provider.getSigner();
    const erc20Token = new ethers.Contract(ERC20_TOKEN, Token.abi, signer);

    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      signer
    );

    console.log(erc20Token);
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether');

    // const tx = await erc20Token.approve(Market_ADDRESS, price);
    // await tx.wait();

    const walletAddress = await signer.getAddress();

    const tx = await marketContract.buyNftFromMarket(
      ERC20_TOKEN,
      nft.tokenId,
      NFT_ADDRESS
    );

    await tx.wait();
    setProcessing(false);
    getNFTS();

    // const allowance = await erc20Token.allowance(walletAddress, Market_ADDRESS);
    // const balance = await erc20Token.balanceOf(Market_ADDRESS);
    // console.log( allowance.toString() , balance.toString());

    // if (allowance.toString() === price.toString()) {
    //   console.log("ssdasda");
    //   const tx = await marketContract.buyNftFromMarket(
    //     ERC20_TOKEN,
    //     nft.tokenId,
    //     NFT_ADDRESS
    //   );
    //   console.log("4");
    //   await tx.wait();
    //   setProcessing(false);
    //   getNFTS();
    //   console.log("3");
    // } else {
    //   console.log("Transaction failed");
    // }

    // //   provider.on("block", (blockNumber) => {
    // //     console.log(blockNumber)
    // // })
    // provider.on("DebugLog", (message, price) => {
    //   console.log(message, price);
    // });
  };

  return (
    <div className="h-full flex flex-col w-full">
      <Dashboard artWork={nfts.length} collections={collections.length} />
      <div className="pt-40 space-y-10 text-3xl">
        <h2 className="text-white font-serif font-semibold">
          Top Collections{' '}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-5">
          {collections.length ? (
            collections.map((item, index) =>
              index <= 20 ? (
                <SingleCollection
                  key={item.address + item.transactionHash}
                  index={index}
                  item={item}
                />
              ) : null
            )
          ) : (
            <div>Loading ..</div>
          )}
        </div>
      </div>
      <div className="pt-20 space-y-10 text-3xl">
        <h2 className="text-white font-serif font-semibold">Top NFT </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {nfts.length ? (
            <NftGridView
              nftList={nfts}
              redirectDetailPage={redirectNFTDetailPage}
            />
          ) : (
            <div>Loading ..</div>
          )}
        </div>
      </div>
      <div className="pt-20 space-y-10 text-3xl">
        <h2 className="text-white font-serif font-semibold">On Auction</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {nfts.length ? (
            <NftGridView
              nftList={nfts}
              redirectDetailPage={redirectNFTDetailPage}
            />
          ) : (
            <div>Loading ..</div>
          )}
        </div>
      </div>
    </div>
  );
}
