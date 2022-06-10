import SingleGridView from "../components/SingleGridView";
import { ethers } from "ethers";
import axios from "axios";
import { NFT_ADDRESS, Market_ADDRESS } from "../config";
import NFT from "../artifacts/contracts/NFT.sol/NFT.json";
import Market from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import React, { useEffect, useState } from "react";

const Nft = () => {
  const [myNft, setMyNft] = useState([]);

  useEffect(() => {
    getMyNFTS();
  }, []);

  const getMyNFTS = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac"
    );
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchItemsCreated();

    console.log({ data });
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(item.price.toString(), "ether");
        let formateItem = {
          price,
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
        };

        return formateItem;
      })
    );
    setMyNft((preState) => (preState = items));
  };

  if (!myNft.length) {
    return <h3>You does not have any NFT !!</h3>;
  }

  console.log({myNft});

  return (
    <div className="grid grid-cols-4 gap-5 my-5 px-5">
      {myNft.map((item) => (
        <SingleGridView
          key={item.tokenId}
          nft={item}
          isBuy={false}
          processing={false}
          buyNFT={() => {}}
        />
      ))}
    </div>
  );
};

export default Nft;
