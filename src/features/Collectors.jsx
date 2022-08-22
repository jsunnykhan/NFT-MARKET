import React, { useState, useEffect } from 'react';
import {
  _getOwnCollections,
  _getCollectionOwnMintedItems,
} from '../helper/events.ts';
import axios from 'axios';

import { _getTokenUri, _getAllOwnedCollection } from '../helper/collection.ts';
import NftGridView from '../components/NftGridView';
import { useRouter } from 'next/router';
import GlowingButton from '../components/GlowingButton';
import { useConnect } from '../helper/hooks/useConnect';
import SingleCollection from '../components/SingleCollectionView';

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
    } else {
      setMintedItems([]);
    }
  };

  const connectWallet = async () => {
    try {
      await connect();
    } catch (error) {}
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
                name: data.name,
                description: data.description,
                image: data.image,
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

  console.log(mintedItems);

  // const contractInit = async () => {
  //   const web3modal = new Web3Modal();
  //   const connectMA = await web3modal.connect();
  //   const provider = new ethers.providers.Web3Provider(connectMA);
  //   const signer = provider.getSigner();

  //   const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, signer);

  //   const marketContract = new ethers.Contract(
  //     Market_ADDRESS,
  //     Market.abi,
  //     signer
  //   );

  //   return { marketContract, nftContract };
  // };

  // const getMintedNft = async () => {
  //   const data = await _getMintedNFT();

  //   const { marketContract, nftContract } = await contractInit();

  //   const items = await Promise.all(
  //     data.map(async (item) => {
  //       const tokenUri = await nftContract.tokenURI(item.tokenId);
  //       const metaData = await axios.get(tokenUri);
  //       let formateItem = {
  //         tokenId: item.tokenId.toString(),
  //         seller: item.seller,
  //         owner: item.owner,
  //         image: metaData.data.image,
  //         name: metaData.data.name,
  //         description: metaData.data.description,
  //         attributes: metaData.data.attributes,
  //       };

  //       return formateItem;
  //     })
  //   );
  //   setMintedNft((preState) => (preState = items));
  // };

  // const getNftCreated = async () => {
  //   const { marketContract, nftContract } = await contractInit();

  //   const data = await marketContract.fetchItemsCreated();
  //   const items = await Promise.all(
  //     data.map(async (item) => {
  //       const tokenUri = await nftContract.tokenURI(item.tokenId);
  //       const metaData = await axios.get(tokenUri);
  //       const price = ethers.utils.formatUnits(item.price.toString(), "ether");
  //       let formateItem = {
  //         price,
  //         tokenId: item.tokenId.toString(),
  //         seller: item.seller,
  //         owner: item.owner,
  //         image: metaData.data.image,
  //         name: metaData.data.name,
  //         description: metaData.data.description,
  //         attributes: metaData.data.attributes,
  //       };

  //       return formateItem;
  //     })
  //   );
  //   setCreatedNft((preState) => (preState = items));
  // };

  // const getOwnedItems = async () => {
  //   const { marketContract, nftContract } = await contractInit();

  //   const data = await marketContract.fetchMyNft();
  //   const items = await Promise.all(
  //     data.map(async (item) => {
  //       const tokenUri = await nftContract.tokenURI(item.tokenId);
  //       const metaData = await axios.get(tokenUri);
  //       const price = ethers.utils.formatUnits(item.price.toString(), "ether");
  //       let formateItem = {
  //         price,
  //         tokenId: item.tokenId.toString(),
  //         seller: item.seller,
  //         owner: item.owner,
  //         image: metaData.data.image,
  //         name: metaData.data.name,
  //         description: metaData.data.description,
  //         attributes: metaData.data.attributes,
  //       };

  //       return formateItem;
  //     })
  //   );
  //   setOwnedNft((preState) => (preState = items));
  // };

  const redirectNftDetailPage = (tokenId, collection) => {
    const link = `collectors/${collection}:${tokenId}`;
    router.push(link);
  };

  // if (!createdNft.length && !mintedNft.length && !ownedNft.length) {
  //   return (
  //     <h3 className="m-auto justify-center items-center text-center py-20">
  //       You does not have any NFT !!
  //     </h3>
  //   );
  // }

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
    <div className="my-10">
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
            redirectNftDetailPage={redirectNftDetailPage}
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
      ) : (
        <div></div>
        // <NftGridView
        //   nftList={ownedNft}
        //   notFoundMessage="No NFT found that you owned"
        //   redirectNftDetailPage={redirectNftDetailPage}
        // />
      )}
    </div>
  );
};

export default Collectors;
