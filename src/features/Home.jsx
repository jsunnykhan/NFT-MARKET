import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from "web3modal";
import { _getAllCollections } from "../helper/events.ts";
import axios from "axios";
import {
  _getMarketContract,
  _getCollectionContract,
} from "../helper/contracts.ts";
import Dashboard from "../components/Dashboard";
import SingleCollection from "../components/SingleCollectionView";
import { _getAllAuctionItems } from "../helper/auction.ts";
import NftGridView from "../components/NftGridView";
import { _getTokenUri } from "../helper/collection.ts";
import { useRouter } from "next/router";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [auctionItems, setAuctionItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [processing, setProcessing] = useState(false);

  const router = useRouter();

  useEffect(() => {
    init();
    getAuctionItems();
  }, []);

  const getAuctionItems = async () => {
    const items = await _getAllAuctionItems();

    const tempItems = await Promise.all(
      items.map(async (item) => {
        const metaData = await _getTokenUri(
          item.address,
          item.tokenId.toString()
        );
        /**
         * @key id: For NftGridview component to have a common attribute
         * to create the link
         */
        let formatItem = {
          id: item.auctionId.toString(),
          tokenId: item.tokenId.toString(),
          creator: item.creator,
          owner: item.seller,
          collectionAddress: item.nftContract,
          price: ethers.utils.formatUnits(item.baseValue.toString(), "ether"),
          image: metaData.image,
          name: metaData.name,
          description: metaData.description,
        };
        return formatItem;
      })
    );
    setAuctionItems(tempItems);
  };

  const init = async () => {
    /**
     * Get collection
     */
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

    /**
     * Get Nfts
     */
    let listOfItem;
    try {
      const data = await market.listingItems();

      listOfItem = await Promise.all(
        data.map(async (item) => {
          const address = item.collectionAddress;
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            "ether"
          );
          const listingId = item.listingId.toString();
          /**
           * @key id: For NftGridview component to have a common attribute
           * to create the link
           */
          const metaData = await _getTokenUri(address, item.tokenId.toString());
          let formatItem = {
            listingId,
            price,
            id: item.tokenId.toString(),
            tokenId: item.tokenId.toString(),
            creator: item.creator,
            owner: item.owner,
            collectionAddress: address,
            image: metaData.image,
            name: metaData.name,
            description: metaData.description,
          };
          return formatItem;
        })
      );
      setNfts((pre) => (pre = listOfItem));
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * @dev Create nft page link and push
   * @param {string|Number} tokenId
   * @param {string} collection
   */
  const redirectNFTDetailPage = (tokenId, collection) => {
    const link = `collectors/${collection}:${tokenId}`;
    router.push(link);
  };

  /**
   * @dev Create auction page link and push
   * @param {string|Number} auctionId
   */
  const redirectAuctionDetailPage = (auctionId, collection) => {
    const link = `auction/${collection}:${auctionId}`;
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
      const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
      console.log(price);

      const tx = await marketContract.createMarketSale(
        NFT_ADDRESS,
        nft.tokenId,
        { value: price }
      );
      console.log("4");
      await tx.wait();
      setProcessing(false);
      getNFTS();
      console.log("3");
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
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

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
      <Dashboard
        artWork={nfts.length}
        collections={collections.length}
        auctions={auctionItems.length}
      />
      <div className="pt-40 space-y-10 text-3xl">
        <h2 className="text-white font-serif font-semibold">
          Top Collections{" "}
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
        <div>
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
        <div>
          {auctionItems.length ? (
            <NftGridView
              nftList={auctionItems}
              redirectDetailPage={redirectAuctionDetailPage}
            />
          ) : (
            <div>Loading ..</div>
          )}
        </div>
      </div>
    </div>
  );
}
