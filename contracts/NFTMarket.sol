// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

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

    struct AuctionItem {
        uint256 id;
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable beneficiary;
        uint256 auctionEndTime;
        uint256 baseValue;
        address highestBidder;
        uint256 highestBid;
        bool ended;
        bool sold;
    }

    AuctionItem[] public auctionItems;

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

    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);
    event AuctionStarted(uint256 startTime);
    event BeneficiaryPaid(address beneficiary, uint256 amount);

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

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit MarketItemCreated(
            newItemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
    }

    function buyNftFromMarket(
        address con,
        uint256 itemId,
        address nftContract
    ) public {
        uint256 price = _idToMarketItem[itemId].price;
        uint256 tokenId = _idToMarketItem[itemId].tokenId;
        address seller = _idToMarketItem[itemId].seller;

        IVSCoins(con).transferTo(address(this), price);
        IVSCoins(con).transfer(seller, price);

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

    /**
     *
     *
     *
     *
     *   Auction Functions
     *
     *
     *
     *
     **/

    function startAuction(
        uint256 _biddingTime,
        uint256 _baseValue,
        address _nftContract,
        uint256 _itemId,
        uint256 _tokenId
    ) public payable {
        uint256 _auctionId = auctionItems.length;
        auctionItems.push(
            AuctionItem(
                _auctionId,
                _itemId,
                _nftContract,
                _tokenId,
                payable(msg.sender),
                block.timestamp + _biddingTime,
                _baseValue,
                address(0),
                0,
                false,
                false
            )
        );
        emit AuctionStarted(auctionItems[_auctionId].auctionEndTime);
    }

    function bid(
        uint256 _auctionId,
        uint256 _amount,
        address _tokenAddr
    ) public {
        if (block.timestamp > auctionItems[_auctionId].auctionEndTime) {
            revert("AUC101: Auction has already ended");
        }

        if (_amount <= auctionItems[_auctionId].baseValue) {
            revert("AUC102: Bid cannot be less than b_amount");
        }

        if (_amount <= auctionItems[_auctionId].highestBid) {
            revert("AUC103: These already a higher or equal bid");
        }

        uint256 currentAllowance = IVSCoins(_tokenAddr).allowance(
            msg.sender,
            address(this)
        );

        console.log("currentAllowance", currentAllowance);
        console.log("msg.sender in bid fn: %s", msg.sender);

        if (currentAllowance <= 0) {
            IVSCoins(_tokenAddr).approve(address(this), _amount);
            if (auctionItems[_auctionId].highestBid != 0) {
                IVSCoins(_tokenAddr).decreaseAllowance(
                    address(this),
                    auctionItems[_auctionId].highestBid,
                    auctionItems[_auctionId].highestBidder
                );
            }
        } else {
            if (msg.sender == auctionItems[_auctionId].highestBidder) {
                IVSCoins(_tokenAddr).decreaseAllowance(
                    address(this),
                    auctionItems[_auctionId].highestBid,
                    auctionItems[_auctionId].highestBidder
                );

                IVSCoins(_tokenAddr).increaseAllowance(
                    address(this),
                    _amount,
                    msg.sender
                );
            } else {
                IVSCoins(_tokenAddr).increaseAllowance(
                    address(this),
                    _amount,
                    msg.sender
                );
                if (auctionItems[_auctionId].highestBid != 0) {
                    IVSCoins(_tokenAddr).decreaseAllowance(
                        address(this),
                        auctionItems[_auctionId].highestBid,
                        auctionItems[_auctionId].highestBidder
                    );
                }
            }
        }

        auctionItems[_auctionId].highestBidder = msg.sender;
        auctionItems[_auctionId].highestBid = _amount;
        emit HighestBidIncreased(
            auctionItems[_auctionId].highestBidder,
            auctionItems[_auctionId].highestBid
        );
    }

    function auctionEnd(
        uint256 _auctionId,
        address _tokenAddr,
        uint256 _itemId,
        address nftContract
    ) public {
        uint256 tokenId = _idToMarketItem[_itemId].tokenId;
        if (block.timestamp < auctionItems[_auctionId].auctionEndTime) {
            revert("AUC105: Auction has not ended yet");
        }

        if (auctionItems[_auctionId].ended) {
            revert("AUC106: The function has already been called");
        }

        uint256 transferAmount = auctionItems[_auctionId].highestBid;
        address beneficiary = auctionItems[_auctionId].beneficiary;
        address highestBidder = auctionItems[_auctionId].highestBidder;

        console.log(
            "currentAllowance",
            IVSCoins(_tokenAddr).allowance(highestBidder, address(this))
        );
        console.log("msg.sender in bid fn: %s", msg.sender);

        auctionItems[_auctionId].ended = true;
        emit AuctionEnded(highestBidder, transferAmount);

        IVSCoins(_tokenAddr).transferFrom(
            highestBidder,
            beneficiary,
            transferAmount
        );

        IERC721(nftContract).transferFrom(address(this), highestBidder, tokenId);
        _idToMarketItem[_itemId].owner = payable(msg.sender);
        _idToMarketItem[_itemId].sold = true;
        auctionItems[_auctionId].sold = true;
        _itemsSold.increment();
    }

    function getauctionItems() public view returns (AuctionItem[] memory) {
        return auctionItems;
    }

    function getItem(uint256 _auctionId)
        public
        view
        returns (AuctionItem memory)
    {
        return auctionItems[_auctionId];
    }

    function getHighestBidder(uint256 _id) public view returns (address) {
        return auctionItems[_id].highestBidder;
    }

    function getHighestBid(uint256 _id) public view returns (uint256) {
        return auctionItems[_id].highestBid;
    }
}

abstract contract IVSCoins {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual returns (bool);

    function transferTo(address to, uint256 amount)
        public
        virtual
        returns (bool);

    function transfer(address recipient, uint256 amount)
        public
        virtual
        returns (bool);

    function approve(address spender, uint256 amount)
        public
        virtual
        returns (bool);

    function allowance(address owner, address spender)
        public
        view
        virtual
        returns (uint256);

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue,
        address highestBidder
    ) public virtual returns (bool);

    function increaseAllowance(
        address spender,
        uint256 addedValue,
        address highestBidder
    ) public virtual returns (bool);
}
