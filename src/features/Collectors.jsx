import React, { useState, useEffect } from 'react';
import NftGridView from '../components/NftGridView';
import GlowingButton from '../components/GlowingButton';
import SingleCollection from '../components/SingleCollectionView';
import {
  _getOwnCollections,
  _getCollectionOwnMintedItems,
} from '../helper/events.ts';
import { _getTokenUri, _getAllOwnedCollection } from '../helper/collection.ts';
import { useRouter } from 'next/router';
import { useConnect } from '../helper/hooks/useConnect';
import { ipfsToHttp } from '../helper/ipfsToHttp.ts';
import Profile from '../components/Profile';
import axios from 'axios';
import ReactLoading from 'react-loading';

const Collectors = () => {
  const [mintedItems, setMintedItems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [ownedNft, setOwnedNft] = useState([]);
  const [tabHandle, setTabHandler] = useState('owned');

  const router = useRouter();

  const [account, chainId, connect, isMetamask] = useConnect();

  useEffect(() => {
    if (account) {
      init();
    } else {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, collections.length]);

  const init = async () => {
    await getAllOwnedCollection();
    if (collections.length) {
      await getAllOwnedMintedItem();
      getOwnedItems();
    } else {
      setMintedItems([]);
    }
  };

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error(error.message);
    }
  };

  const getAllOwnedCollection = async () => {
    const collection = await _getAllOwnedCollection(account);
    setCollections((pre) => (pre = collection));
  };

  const getAllOwnedMintedItem = async () => {
    try {
      const mintedItems = await Promise.all(
        collections.map(async (collection) => {
          const items = await _getCollectionOwnMintedItems(
            collection.address,
            account
          );
          const mintedItem = await Promise.all(
            items.map(async (item) => {
              const data = await _getTokenUri(
                collection.address,
                item.returnValues.tokenId
              );
              const details = {
                id: item.returnValues.tokenId,
                name: data.name,
                description: data.description,
                image: ipfsToHttp(data.image),
                collectionAddress: collection.address,
                tokenId: item.returnValues.tokenId,
              };

              return details;
            })
          );

          return mintedItem;
        })
      );

      setMintedItems((pre) => (pre = mintedItems.flat(1)));
    } catch (error) {
      console.error(error);
    }
  };

  const getOwnedItems = async () => {
    console.log(account);
    try {
      const _ownedItems = await axios.get(`/api/mynfts?userAddress=${account}`);
      setOwnedNft(_ownedItems.data.nfts);
      console.log(_ownedItems.data.nfts);
    } catch (error) {
      console.log(error);
    }
  };

  const redirectNftDetailPage = (tokenId, collection) => {
    const link = `collectors/${collection}:${tokenId}`;
    router.push(link);
  };

  const tabChangeHandler = (tab) => {
    setTabHandler(tab);
  };

  const tabInfo = [
    {
      name: 'Owned items',
      route: 'owned',
    },
    {
      name: 'Collections',
      route: 'collection',
    },
    {
      name: 'Minted items',
      route: 'mint',
    },
  ];

  return (
    <div className="py-5 flex flex-col space-y-5">
      <Profile address={account} isCollection={false} />
      <div className="flex justify-center space-x-5 pb-10">
        <div className="grid grid-cols-3 grid-rows-1 gap-7">
          {tabInfo.map((info) => (
            <GlowingButton
              key={info.route}
              text={info.name}
              route={info.route}
              tabHandler={tabChangeHandler}
            />
          ))}
        </div>
      </div>

      {tabHandle === 'mint' ? (
        <div>
          <NftGridView
            nftList={mintedItems}
            notFoundMessage="You never mint any NFT"
            redirectDetailPage={redirectNftDetailPage}
          />
        </div>
      ) : tabHandle === 'collection' ? (
        <div className="w-full space-y-5">
          <h2 className="font-semibold underline underline-offset-8 text-2xl font-mono">
            Collections
          </h2>
          <div className="grid grid-cols-4 w-full">
            {collections.map((collection, index) => (
              <SingleCollection
                key={collection.address}
                index={index}
                item={collection}
              />
            ))}
          </div>
        </div>
      ) : tabHandle === 'owned' ? (
        <div className="w-full space-y-5">
          {ownedNft.length === 0 ? (
            <div className="flex items-center justify-center">
              <ReactLoading
                type="bubbles"
                height={'10%'}
                width={'10%'}
                color="#471363"
              />
            </div>
          ) : (
            <NftGridView
              nftList={ownedNft}
              notFoundMessage="You don't any NFT"
              redirectDetailPage={redirectNftDetailPage}
            />
          )}
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Collectors;
