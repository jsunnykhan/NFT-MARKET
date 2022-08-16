import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { NFT_ADDRESS, Market_ADDRESS } from "../../config";
import collection from "../../artifacts/contracts/market/Collection.sol/Collection.json";
import market from "../../artifacts/contracts/market/NFTMarket.sol/NFTMarket.json";

const configure = async (): Promise<ethers.providers.Web3Provider> => {
    const web3modal = new Web3Modal();
    const connectMA = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connectMA);
    return provider;
};

export const _minting = async (url: string) => {
    const provider = await configure();
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(NFT_ADDRESS, collection.abi, signer);
    let transaction = await nftContract.createToken(url);
    let tx = await transaction.wait();
    console.log(tx);

    const event = tx.events[0];
    const value = event.args.tokenId;
    const tokenId = value.toString();
    console.log(typeof tokenId);
    return tokenId;
};

export const _getMintedNFT = async () => {
    const provider = await configure();
    const signer = provider.getSigner();
    const nftContract = new ethers.Contract(NFT_ADDRESS, collection.abi, signer);

    const mintedNFT = await nftContract.getMintedNFT();
    return mintedNFT;
};

export const _listingToMarket = async (tokenId: number, price: string) => {
    const provider = await configure();
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract(
        Market_ADDRESS,
        market.abi,
        signer
    );

    let listingPrice = await marketContract.getMarketListingPrice();
    listingPrice = listingPrice.toString();
    const pri = ethers.utils.parseUnits(price, "ether");
    const transaction = await marketContract.addItemInMarket(
        NFT_ADDRESS,
        tokenId,
        pri,
        { value: listingPrice }
    );

    const tx = await transaction.wait();

    return tx;
};
