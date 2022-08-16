
import { ethers } from "ethers";
import { NFT_ADDRESS, Market_ADDRESS, ERC20_TOKEN, AUCTION_MARKET } from "../../config";
import collection from "../../artifacts/contracts/market/Collection.sol/Collection.json";
import market from "../../artifacts/contracts/market/NFTMarket.sol/NFTMarket.json";
import token from "../../artifacts/contracts/token/ERC20/VsCoin.sol/VSCoin.json";
import auction from "../../artifacts/contracts/market/AuctionMarket.sol/AuctionMarket.json"

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
const infuraApiKey = process.env.NEXT_PUBLIC_INFURA_API_KEY;

const URL: string = `${baseURL}/${infuraApiKey}`;


const _getProvider = (): ethers.providers.JsonRpcProvider => {
    console.log(URL);
    const jsonRpcProvider: ethers.providers.JsonRpcProvider = new ethers.providers.JsonRpcProvider(URL);
    return jsonRpcProvider;
}

export const _getCollectionContract = (): ethers.Contract => {
    const contract: ethers.Contract = new ethers.Contract(NFT_ADDRESS, collection.abi, _getProvider());
    return contract;
}

export const _getMarketContract = (): ethers.Contract => {
    const contract: ethers.Contract = new ethers.Contract(Market_ADDRESS, market.abi, _getProvider());
    return contract;
}

export const _getERC20Contract = (): ethers.Contract => {
    const contract: ethers.Contract = new ethers.Contract(ERC20_TOKEN, token.abi, _getProvider());
    return contract;
}


export const _getAuctionContract = (): ethers.Contract => {
    const contract = new ethers.Contract(AUCTION_MARKET, auction.abi, _getProvider());
    return contract;
}