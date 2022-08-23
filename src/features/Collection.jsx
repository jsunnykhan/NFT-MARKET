import React, { useEffect, useState } from "react";
import { _getCollectionMintedItems } from "../helper/events.ts";
import { _getCollectionContract } from "../helper/contracts.ts";
import SingleGridView from "../components/SingleGridView";
import axios from "axios";
import { ipfsToHttp } from "../helper/ipfsToHttp.ts";
import Profile from "../components/Profile";

const Collection = (props) => {
  const { address } = props;

  const [items, setItems] = useState([]);
  const [details, setDetails] = useState({
    name: "",
    owner: "",
  });

  const getItems = async () => {
    const collection = await _getCollectionContract(address);
    const owner = await collection.contractOwner();
    const name = await collection.name();
    setDetails((pre) => (pre = { name, owner }));
    const listOfItems = await _getCollectionMintedItems(address);

    try {
      const items = listOfItems.map(async (item) => {
        const uri = await collection.tokenURI(item.returnValues.tokenId);
        console.log(uri);
        const metaData = await axios.get(ipfsToHttp(uri));

        const items = {
          name: metaData.name,
          description: metaData.description,
          image: metaData.image,
        };
        return items;
      });
      setItems((pre) => (pre = items));
    } catch (error) {}
  };

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });
    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    if (address) {
      getItems();
    }
  }, [address]);

  if (!items.length) {
    return (
      <h2 className="font-mono text-3xl flex justify-center capitalize">
        Collection Address wrong!!
      </h2>
    );
  }

  console.log(items);

  return (
    <div className="py-5">
      <Profile />
      <div className="flex flex-col space-y-2">
        <h2 className="text-3xl font-mono capitalize">{details.name}</h2>
        <h3 className="text-white-100 truncate">
          <span className="text-white text-xl">Created by </span>
          {details.owner}
        </h3>
      </div>
      <div className="grid grid-cols-4 gap-5">
        {items.length &&
          items.map((item) => {
            // <SingleGridView key={item.tokenId} nft={item} isBuy={false} />;
          })}
      </div>
    </div>
  );
};

export default Collection;
