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

  describe("Erc20 Token", () => {
    it("should return totalSupply", async () => {
      const balance = await erc20token.totalSupply();
      expect(balance).to.equal(BigNumber.from(100000000000000000000000n));
    });

    it("should approve 7vs token", async () => {
      const approve = await erc20token.approve(
        addr1.address,
        7000000000000000000n
      );

      const allowance = await erc20token.allowance(
        owner.address,
        addr1.address
      );

      expect(allowance).to.equal(7000000000000000000n);
    });

    it("should Transfer From 7Vs token to address1", async () => {
      await erc20token.approve(addr1.address, 7000000000000000000n);
      const allowance = await erc20token.allowance(
        owner.address,
        addr1.address
      );

      expect(allowance).to.equal(7000000000000000000n);

      await erc20token
        .connect(addr1)
        .transferFrom(owner.address, addr1.address, 7000000000000000000n);
      const balance = await erc20token.balanceOf(addr1.address);
      const ownerBalance = await erc20token.balanceOf(owner.address);
      console.log(ownerBalance.toString());
      expect(balance).to.equal(7000000000000000000n);
    });
  });
});
