const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  let erc20token;
  let collection;
  let marketNftToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const Market = await ethers.getContractFactory("NFTMarket");
    marketNftToken = await Market.deploy(10);
    await marketNftToken.deployed();

    const Collection = await ethers.getContractFactory("Collection");
    collection = await Collection.deploy("test", "t", marketNftToken.address);
    await collection.deployed();

    const Token = await ethers.getContractFactory("VSCoin");
    erc20token = await Token.deploy();
    await erc20token.deployed();
  });

  describe("Collection Nft", function () {
    it("should Mint uri", async () => {
      const tokenId = await collection.createToken("google.com");
      await tokenId.wait();
      const tokenUri = await collection.tokenURI(1);
      expect(tokenUri).to.be.equals("google.com");
    });
    it("should set Approval and transferFrom", async () => {
      const tokenId = await collection.createToken("google.com");
      await tokenId.wait();

      await collection.approve(addr1.address, 1);
      const aprpoveAddress = await collection.getApproved(1);
      expect(aprpoveAddress).to.be.equals(addr1.address);
      const ownerOfBefore = await collection.ownerOf(1);
      // console.log(ownerOfBefore, owner.address);
      await collection.transferFrom(owner.address, addr1.address, 1);
      const ownerOfAfter = await collection.ownerOf(1);
      // console.log(ownerOfAfter, addr1.address);
      expect(ownerOfAfter).to.be.equals(addr1.address);
    });
  });

  
  describe("Market", () => {
    it("should List a nft into a market", async () => {
      const tokenId = await collection.createToken("google.com");
      await tokenId.wait();
      await marketNftToken.createListing(
        1,
        collection.address,
        7000000000000000000n
      );
      const list = await marketNftToken.getListing(1);
      // console.log(list);
      expect(list).to.be.an("array");
    });

    it("should buy listing Nft From Market", async () => {
      const tokenId = await collection.createToken("google.com");
      await tokenId.wait();
      await marketNftToken.createListing(
        1,
        collection.address,
        7000000000000000000n
      );
      const list = await marketNftToken.getListing(1);
      // transfer vs token because addr1 balance is empty
      await erc20token.transfer(addr1.address, 10000000000000000000n);

      const balanceBefore = await erc20token.balanceOf(owner.address);
      const balance = await erc20token.balanceOf(addr1.address);

      await marketNftToken
        .connect(addr1)
        .buyListingItem(
          collection.address,
          1,
          7000000000000000000n,
          erc20token.address
        );

      const ownerOfAfter = await collection.ownerOf(1);
      expect(ownerOfAfter).to.be.equals(addr1.address);
    });

    it("should Listing and Buy multiple time", async () => {
      const tokenId = await collection.createToken("google.com");
      await tokenId.wait();
      await marketNftToken.createListing(
        1,
        collection.address,
        7000000000000000000n
      );

      // transfer vs token because addr1 balance is empty
      await erc20token.transfer(addr1.address, 10000000000000000000n);

      const balance = await erc20token.balanceOf(addr2.address);
      const ownerofBefore = await collection.ownerOf(1);
      await marketNftToken
        .connect(addr1)
        .buyListingItem(
          collection.address,
          1,
          7000000000000000000n,
          erc20token.address
        );

      // 2nd time listing and buy
      await marketNftToken
        .connect(addr1)
        .createListing(1, collection.address, 8000000000000000000n);

      const ownerOf = await collection.ownerOf(1);
      await erc20token.transfer(addr2.address, 10000000000000000000n);
      const balanceBefore = await erc20token.balanceOf(addr2.address);

      await marketNftToken
        .connect(addr2)
        .buyListingItem(
          collection.address,
          2,
          8000000000000000000n,
          erc20token.address
        );

      const balanceAfter = await erc20token.balanceOf(addr1.address);
      const ownerOfAfter = await collection.ownerOf(1);

      expect(ownerOfAfter).to.be.equals(addr2.address);
    });
  });
});
