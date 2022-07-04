// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

    address payable ownerOfContract;
    uint256 private marketListingPrice;

    // function initialize() external virtual override {
    //     ownerOfContract = payable(msg.sender);
    //     marketListingPrice = 0.01 ether;
    // }
    constructor() {
        ownerOfContract = payable(msg.sender);
        marketListingPrice = 0.01 ether;
    }

    // Each of market items
    struct MarketItem {
        uint256 itemId; // item id
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private _idToMarketItem; // giving item id as a key and return marketItem ob.

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address payable seller,
        address payable owner,
        uint256 price,
        bool sold
    );

    function getMarketListingPrice() public view returns (uint256) {

        
        return marketListingPrice;
    }

    /**
     * @dev nftContract - where to new item(nft) deploy
     * @dev tokenId - id from contract
     * @dev price of item(nft)
     */
    function addItemInMarket(
        address nftContract,
        uint256 tokenId,
        uint256 price
    ) public payable nonReentrant {
        require(price > 0, "Price must be at least 1wei");
        require(
            msg.value >= marketListingPrice,
            "You have to pay 0.01 ether to create Nft"
        );

        console.log(
            "Item Exists",
            _idToMarketItem[tokenId].owner != address(0),
            _idToMarketItem[tokenId].owner
        );

        if (_idToMarketItem[tokenId].owner == address(0)) {
            _itemIds.increment();
            uint256 newItemId = _itemIds.current();

            _idToMarketItem[newItemId] = MarketItem(
                newItemId,
                nftContract,
                tokenId,
                payable(msg.sender),
                payable(address(0)),
                price,
                false
            );
        }

        IERC721(nftContract).approve(address(this), tokenId);

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        // emit MarketItemCreated(
        //     newItemId,
        //     nftContract,
        //     tokenId,
        //     payable(msg.sender),
        //     payable(address(0)),
        //     price,
        //     false
        // );
    }

    function buyNftFromMarket(
        address con,
        uint256 itemId,
        address nftContract
    ) public {
        uint256 price = _idToMarketItem[itemId].price;
        uint256 tokenId = _idToMarketItem[itemId].tokenId;
        address seller = _idToMarketItem[itemId].seller;

        VSCoins vivaCoin = VSCoins(con);
        bool res = vivaCoin.transferFrom(msg.sender, address(this), price);
        console.log(res);

        vivaCoin.transferTo(address(this), seller, price);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        _idToMarketItem[itemId].owner = payable(msg.sender);
        _idToMarketItem[itemId].sold = true;
        _itemsSold.increment();
        payable(ownerOfContract).transfer(marketListingPrice);
    }

    /**
     *
     *
     *
     *
     *   Get Functions
     *
     *
     *
     *
     **/
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _itemIds.current();
        uint256 unsoldItemCount = itemCount - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 index = 0; index < itemCount; index++) {
            if (_idToMarketItem[index + 1].owner == address(0)) {
                console.log(
                    "Enter into function",
                    _idToMarketItem[index].owner,
                    address(0)
                );
                uint256 currentId = _idToMarketItem[index + 1].itemId;

                MarketItem storage currentItem = _idToMarketItem[currentId];
                console.log(currentIndex);
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyNft() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 index = 0; index < totalItemCount; index++) {
            if (_idToMarketItem[index + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 index = 0; index < totalItemCount; index++) {
            if (_idToMarketItem[index + 1].owner == msg.sender) {
                uint256 currentId = _idToMarketItem[index + 1].itemId;
                MarketItem storage currentItem = _idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }

        return items;
    }

    function fetchItemsCreated() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _itemIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 index = 0; index < totalItemCount; index++) {
            if (_idToMarketItem[index + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);

        for (uint256 index = 0; index < totalItemCount; index++) {
            if (_idToMarketItem[index + 1].seller == msg.sender) {
                uint256 currentId = _idToMarketItem[index + 1].itemId;
                MarketItem storage currentItem = _idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}

abstract contract VSCoins {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual returns (bool);

    function transferTo(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual returns (bool);
}
