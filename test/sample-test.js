const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("NFT Market", function () {
  it("Should Create and sells", async function () {
    const Market = await ethers.getContractFactory("NFTMarket");

    const market = await Market.deploy();
    await market.deployed();

    const marketAddress = market.address;

    console.log({ marketAddress });

    const Nft = await ethers.getContractFactory("NFT");
    const nft = await Nft.deploy(marketAddress);
    await nft.deployed();

    const nftAddress = nft.address;
    console.log({ nftAddress });
    console.log("---------------------------------------------------");

    let marketListingPrice = await market.getMarketListingPrice();
    marketListingPrice = marketListingPrice.toString();
    const priceOfNft = ethers.utils.parseUnits("1", "ether");

    await nft.createNewToken("google.com");
    await nft.createNewToken("google.com");

    await market.createMarketItem(nftAddress, 1, priceOfNft, {
      value: BigNumber.from(marketListingPrice),
    });

    await market.createMarketItem(nftAddress, 2, priceOfNft, {
      value: BigNumber.from(marketListingPrice),
    });

    const [_, owner] = await ethers.getSigners();

    await market
      .connect(owner)
      .createMarketSale(nftAddress, 2, { value: priceOfNft });

    let items = await market.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await nft.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );

    console.log({ items });

    const create = await market.fetchItemsCreated();

    const myNFt = await market.connect(owner).fetchMyNft();

    console.log({myNFt, create});
  });
});
