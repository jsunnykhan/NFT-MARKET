import Dashboard from '../components/Dashboard';
import SingleCollection from '../components/SingleCollectionView';
import NftGridView from '../components/NftGridView';
import ReactLoading from 'react-loading';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { _getAllCollections } from '../helper/events.ts';
import {
  _getMarketContract,
  _getCollectionContract,
} from '../helper/contracts.ts';
import { _getAllAuctionItems } from '../helper/auction.ts';
import { _getTokenUri } from '../helper/collection.ts';
import { useRouter } from 'next/router';
import { ipfsToHttp } from '../helper/ipfsToHttp.ts';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [auctionItems, setAuctionItems] = useState([]);
  const [collections, setCollections] = useState([]);

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
          price: ethers.utils.formatUnits(item.baseValue.toString(), 'ether'),
          image: ipfsToHttp(metaData.image),
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
     * Get listed Nfts
     */
    let listOfItem;
    try {
      const data = await market.listingItems();
      console.log(data);

      listOfItem = await Promise.all(
        data.map(async (item) => {
          console.log(item);
          const address = item.collectionAddress;
          const price = ethers.utils.formatUnits(
            item.price.toString(),
            'ether'
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
            image: ipfsToHttp(metaData.image),
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
  const redirectNFTDetailPage = (tokenId, collection, id) => {
    const link = `collectors/${collection}:${tokenId}?id=${id}`;
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

  return (
    <div className="h-full flex flex-col w-full">
      <Dashboard
        artWork={nfts.length}
        collections={collections.length}
        auctions={auctionItems.length}
      />
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
            <div>
              <ReactLoading
                type="bubbles"
                height={'10%'}
                width={'10%'}
                color="#471363"
              />
            </div>
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
            <div>
              <ReactLoading
                type="bubbles"
                height={'10%'}
                width={'10%'}
                color="#471363"
              />
            </div>
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
            <div>
              <ReactLoading
                type="bubbles"
                height={'10%'}
                width={'10%'}
                color="#471363"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
