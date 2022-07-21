import SingleGridView from '../components/SingleGridView';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import Web3Modal from 'web3modal';

import { NFT_ADDRESS, Market_ADDRESS, ERC20_TOKEN } from '../config';
import NFT from '../artifacts/contracts/NFT.sol/NFT.json';
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json';
import Token from '../artifacts/contracts/VSCoin.sol/VSCoin.json';
import { _getAuctionItems } from '../utils/NFT';
import { StateContext } from '../components/StateContex';
import crypto from 'crypto';
import { useRouter } from 'next/router';

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [auctionItems, setAuctionItems] = useState([]);

  const { setSingleNft } = useContext(StateContext);

  const router = useRouter();

  useEffect(() => {
    window.ethereum.on('accountsChanged', () => {
      window.location.reload();
    });

    window.ethereum.on('chainChanged', () => {
      window.location.reload();
    });
    getNFTS();
    getAuctionItems();
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

  const getNFTS = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      // "https://rinkeby.infura.io/v3/9c7ba9f1cbfc4f42b2540b8efee326ac"
      'http://127.0.0.1:8545'
    );
    const nftContract = new ethers.Contract(NFT_ADDRESS, NFT.abi, provider);
    const marketContract = new ethers.Contract(
      Market_ADDRESS,
      Market.abi,
      provider
    );
    const data = await marketContract.fetchMarketItems();
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
        };
        return formateItem;
      })
    );
    console.log(items);
    setNfts((preState) => (preState = items));
  };

  const getAuctionItems = async () => {
    const { marketContract, nftContract } = await contractInit();
    const data = await _getAuctionItems();
    const items = await Promise.all(
      data.map(async (item) => {
        const tokenUri = await nftContract.tokenURI(item.tokenId);
        const metaData = await axios.get(tokenUri);
        const price = ethers.utils.formatUnits(
          item.baseValue.toString(),
          'ether'
        );
        const highestBid = ethers.utils.formatUnits(
          item.highestBid.toString(),
          'ether'
        );
        let formateItem = {
          auctionId: Number(item.id),
          itemId: item.itemId.toString(),
          price,
          tokenId: item.tokenId.toString(),
          seller: item.seller,
          owner: item.owner,
          image: metaData.data.image,
          name: metaData.data.name,
          description: metaData.data.description,
          attributes: metaData.data.attributes,
          auctionEndTime: item.auctionEndTime,
          highestBid,
          highestBidder: item.highestBidder.toString(),
        };

        return formateItem;
      })
    );
    setAuctionItems((preState) => (preState = items));
    console.log(items);
  };

  if (!nfts.length && !auctionItems.length) {
    return <h3>No NFT Listed yet !!</h3>;
  }

  const transferToken = async (nft) => {
    console.log(nft);
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
      nft.itemId,
      NFT_ADDRESS
    );

    await tx.wait();
    setProcessing(false);
    getNFTS();
  };

  const redirectAuctionPage = (nft) => {
    console.log(nft);
    setSingleNft(nft);
    const hash = crypto
      .createHash('sha256')
      .update(nft.name + nft.tokenId + nft.seller + '/auction')
      .digest('hex');

    router.push('auction/' + hash);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-5 my-5 px-5">
        {nfts.map((item) => (
          <SingleGridView
            key={item.tokenId}
            nft={item}
            isBuy={true}
            buyNFT={transferToken}
            processing={processing}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-5 my-5 px-5">
        {auctionItems.map((item) => (
          <div
            onClick={() => {
              redirectAuctionPage(item);
            }}
            key={item.tokenId}
          >
            <SingleGridView nft={item} isBuy={false} processing={processing} />
          </div>
        ))}
      </div>
    </>
  );
}
