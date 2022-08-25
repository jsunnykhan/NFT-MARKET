import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import SingleGridView from '../components/SingleGridView';
import axios from 'axios';
import { _getCollectionMintedItems } from '../helper/events.ts';
import { _getCollectionContract } from '../helper/contracts.ts';
import { ipfsToHttp } from '../helper/ipfsToHttp.ts';
import NftGridView from '../components/NftGridView';
import { useRouter } from 'next/router';

const Collection = (props) => {
  const [items, setItems] = useState([]);
  const [details, setDetails] = useState({
    name: '',
    owner: '',
  });
  const [collectionAddress, setCollectionAddress] = useState('');
  const router = useRouter();

  const getItems = async (collectionAddress) => {
    console.log(collectionAddress);
    const collection = await _getCollectionContract(collectionAddress);
    const owner = await collection.contractOwner();
    const name = await collection.name();
    setDetails((pre) => (pre = { name, owner }));
    const listOfItems = await _getCollectionMintedItems(collectionAddress);
    const tempItems = await Promise.all(
      listOfItems.map(async (item) => {
        const uri = await collection.tokenURI(
          item.returnValues.tokenId.toString()
        );
        console.log(ipfsToHttp(uri));
        const metaData = await axios.get(ipfsToHttp(uri));
        const tempItem = {
          name: metaData.data.name,
          description: metaData.data.description,
          image: metaData.data.image,
          id: item.returnValues.tokenId,
          collectionAddress: collectionAddress,
        };
        return tempItem;
      })
    );

    console.log(tempItems);

    setItems(tempItems);
  };

  const redirectNftDetailPage = (tokenId, collection) => {
    const link = `/collectors/${collection}:${tokenId}`;
    router.push(link);
  };

  useEffect(() => {
    const _collectionAddress = window.location.pathname.split('/').pop();
    console.log(_collectionAddress);
    setCollectionAddress(_collectionAddress);
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    if (_collectionAddress) {
      getItems(_collectionAddress);
    }
  }, []);

  console.log(items);

  return (
    <div className="py-5 flex flex-col space-y-5">
      <Profile collectionAddress={collectionAddress} />
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-mono capitalize">{details.name}</h2>
        <h3 className="text-white-100 truncate">
          <span className="text-white text-xl">Created by </span>
          {details.owner}
        </h3>
      </div>
      <div>
        <NftGridView
          nftList={items}
          redirectDetailPage={redirectNftDetailPage}
        />
      </div>
      {/* <div className="grid grid-cols-4 gap-5">
        {items.length &&
          items.map((item) => {
            <SingleGridView key={item.tokenId} nft={item} isBuy={false} />;
          })}
      </div> */}
    </div>
  );
};

export default Collection;
