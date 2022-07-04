const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  let erc20token;
  let nftToken;
  let marketNftToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async () => {
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    const Market = await ethers.getContractFactory("NFTMarket");
    marketNftToken = await Market.deploy();
    await marketNftToken.deployed();

    const Nft = await ethers.getContractFactory("NFT");
    nftToken = await Nft.deploy(marketNftToken.address);
    await nftToken.deployed();

    const Token = await ethers.getContractFactory("VSCoin");
    erc20token = await Token.deploy();
    await erc20token.deployed();
  });

  describe("Nft", function () {
    it("should Mint uri", async () => {
      const tokenId = await nftToken.createNewToken("google.com");
      await tokenId.wait();
    });
  });

  // describe("Erc20 Token", () => {
  //   it("should return totalSupply", async () => {
  //     const balance = await erc20token.totalSupply();
  //     expect(balance).to.equal(BigNumber.from(100000000000000000000000n));
  //   });

  //   it("should approve 7vs token", async () => {
  //     const approve = await erc20token.approve(
  //       addr1.address,
  //       7000000000000000000n
  //     );

  //     const allowance = await erc20token.allowance(
  //       owner.address,
  //       addr1.address
  //     );

  //     expect(allowance).to.equal(7000000000000000000n);
  //   });

  //   it("should Transfer From 7Vs token to address1", async () => {
  //     await erc20token.approve(addr1.address, 7000000000000000000n);
  //     const allowance = await erc20token.allowance(
  //       owner.address,
  //       addr1.address
  //     );

  //     expect(allowance).to.equal(7000000000000000000n);

  //     await erc20token
  //       .connect(addr1)
  //       .transferFrom(owner.address, addr1.address, 7000000000000000000n);
  //     const balance = await erc20token.balanceOf(addr1.address);
  //     const ownerBalance = await erc20token.balanceOf(owner.address);
  //     console.log(ownerBalance.toString());
  //     expect(balance).to.equal(7000000000000000000n);
  //   });
  // });

  // describe("NFT Market", () => {
  //   it("should List a nft into a market", async () => {
  //     const tokenId = await nftToken.createNewToken("google.com");
  //     await tokenId.wait();

  //     await marketNftToken.addItemInMarket(
  //       nftToken.address,
  //       1,
  //       7000000000000000000n,
  //       { value: 10000000000000000n }
  //     );

  //     const items = await marketNftToken.fetchMarketItems();
  //     expect(items).to.be.an("array");
  //   });

  //   it("should buy Nft From Market", async () => {
  //     const tokenId = await nftToken
  //       .connect(addr2)
  //       .createNewToken("google.com");
  //     await tokenId.wait();
  //     await marketNftToken
  //       .connect(addr2)
  //       .addItemInMarket(nftToken.address, 1, 7000000000000000000n, {
  //         value: 10000000000000000n,
  //       });

  //     await erc20token.transfer(addr1.address, 10000000000000000000n);
  //     const approve = await erc20token
  //       .connect(addr1)
  //       .approve(marketNftToken.address, 7000000000000000000n);

  //     const allowance = await erc20token.allowance(
  //       addr1.address,
  //       marketNftToken.address
  //     );

  //     console.log(allowance.toString());
  //     const balanceOfSellerBefore = await erc20token.balanceOf(addr2.address);
  //     await marketNftToken
  //       .connect(addr1)
  //       .buyNftFromMarket(erc20token.address, 1, nftToken.address);

  //     const balanceOfSender = await erc20token.balanceOf(addr1.address);
  //     const balanceOfSeller = await erc20token.balanceOf(addr2.address);
  //     console.log({ balanceOfSender, balanceOfSellerBefore, balanceOfSeller });
  //   });
  // });

  describe("NFT Market ReSell", () => {
    it("should buy previous sell items", async () => {
      const tokenId = await nftToken
        .connect(addr2)
        .createNewToken("google.com");
      await tokenId.wait();
      
      await marketNftToken
        .connect(addr2)
        .addItemInMarket(nftToken.address, 1, 7000000000000000000n, {
          value: 10000000000000000n,
        });

      await erc20token.transfer(addr1.address, 10000000000000000000n);
      const approve = await erc20token
        .connect(addr1)
        .approve(marketNftToken.address, 7000000000000000000n);

      const allowance = await erc20token.allowance(
        addr1.address,
        marketNftToken.address
      );

      console.log(allowance.toString());
      const balanceOfSellerBefore = await erc20token.balanceOf(addr2.address);
      await marketNftToken
        .connect(addr1)
        .buyNftFromMarket(erc20token.address, 1, nftToken.address);

      const balanceOfSender = await erc20token.balanceOf(addr1.address);
      const balanceOfSeller = await erc20token.balanceOf(addr2.address);
      console.log({ balanceOfSender, balanceOfSellerBefore, balanceOfSeller });

      await marketNftToken
        .connect(addr1)
        .addItemInMarket(nftToken.address, 1, 8000000000000000000n, {
          value: 10000000000000000n,
        });

      await erc20token.transfer(addr2.address, 10000000000000000000n);
      const approve2 = await erc20token
        .connect(addr2)
        .approve(marketNftToken.address, 7000000000000000000n);

      const allowance2 = await erc20token.allowance(
        addr2.address,
        marketNftToken.address
      );

      console.log(allowance.toString());
      const balanceOfSellerBefore2 = await erc20token.balanceOf(addr2.address);
      await marketNftToken
        .connect(addr2)
        .buyNftFromMarket(erc20token.address, 1, nftToken.address);
    });
  });
});
