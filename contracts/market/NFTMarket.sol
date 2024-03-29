// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "../token/ERC20/IERC20.sol";
import "../token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "../utils/Ownable.sol";
import "../utils/Context.sol";

abstract contract ICollection {
    function creatorOf(uint256 tokenId) public view virtual returns (address);
}

contract NFTMarket is ReentrancyGuard, Ownable, Context {
    using Counters for Counters.Counter;
    Counters.Counter private _listingId;

    uint256 private _marketFee;
    // add a default collection here

    enum State {
        LISTED,
        SOLD
    }

    struct Listing {
        uint256 listingId; // `listingId` Market listing index
        uint256 tokenId; // `tokenId` ERC721 or ERC1155 collections index
        address collectionAddress; // Collection address
        address payable creator; // `creator` who create/mint this token
        address payable owner; // `owner` who own this token
        bool listed; // token State Listed or sold
        uint256 price; // price of this token
    }

    mapping(uint256 => Listing) private _listings;

    event listed(
        uint256 listingId,
        address indexed collectionAddress,
        uint256 indexed tokenId,
        address payable creator,
        address payable indexed owner,
        uint256 price
    );

    event buyItem(
        uint256 indexed tokenId,
        address indexed collectionAddress,
        address payable creator,
        address payable owner,
        bool isErc721,
        uint256 price
    );

    event CollectionCreated(
        address indexed owner,
        address indexed collectionAddress,
        string name,
        string symbol
    );

    constructor(uint256 marketFee) {
        _marketFee = marketFee;
    }

    function getMarketFee() public view returns (uint256) {
        return _marketFee;
    }

    function setMarketFee(uint256 marketFee) public virtual onlyOwner {
        _marketFee = marketFee;
    }

    function getListing(uint256 listingId)
        public
        view
        virtual
        returns (Listing memory)
    {
        return _listings[listingId];
    }

    function getListingStatus(uint256 listingId)
        public
        view
        virtual
        returns (bool)
    {
        return _listings[listingId].listed;
    }

    function createListing(
        uint256 tokenId,
        address collectionAddress,
        uint256 price
    ) public virtual returns (bool success) {
        _listingId.increment();
        uint256 newListingId = _listingId.current();
        require(
            _listings[newListingId].listingId != newListingId,
            "Item is already listed"
        );
        address _owner = IERC721(collectionAddress).ownerOf(tokenId);
        address _creator = ICollection(collectionAddress).creatorOf(tokenId);
        require(_owner == msg.sender, "This token not belongs to this address");
        IERC721(collectionAddress).approve(address(this), tokenId); // collenction should be tx.origin

        Listing memory listing = Listing(
            newListingId,
            tokenId,
            collectionAddress,
            payable(_creator),
            payable(_owner),
            true,
            price
        );
        _listings[newListingId] = listing;

        emit listed(
            newListingId,
            collectionAddress,
            tokenId,
            payable(_creator),
            payable(_owner),
            price
        );
        return true;
    }

    function buyListingItem(
        address collectionAddress,
        uint256 listingId_,
        uint256 price_,
        address tokenAddress
    ) public virtual returns (bool) {
        Listing memory listing = _listings[listingId_];
        uint256 price = listing.price;
        require(price_ >= price, "Market - Insufficient Balance");

        uint256 listingId = listing.listingId;
        uint256 tokenId = listing.tokenId;
        address ownerOf = IERC721(collectionAddress).ownerOf(tokenId);

        address creator = payable(listing.creator);
        IERC20(tokenAddress).transfer(ownerOf, price);
        IERC721(collectionAddress).transferFrom(
            ownerOf,
            address(this),
            tokenId
        );
        IERC721(collectionAddress).approve(_msgSender(), tokenId);
        IERC721(collectionAddress).safeTransferFrom(
            address(this),
            _msgSender(),
            tokenId
        );

        emit buyItem(
            tokenId,
            collectionAddress,
            payable(creator),
            payable(ownerOf),
            true,
            price
        );

        _deleteListingItem(listingId);

        return true;
    }

    function _deleteListingItem(uint256 listingId)
        internal
        virtual
        returns (bool)
    {
        delete _listings[listingId];
        return true;
    }

    function createCollectionNotification(
        address ownerOf,
        address collectionAddress,
        string memory name,
        string memory symbol
    ) public virtual {
        emit CollectionCreated(ownerOf, collectionAddress, name, symbol);
    }

    /*
     *
     *
     *  fetch Market Listed Items
     *
     *
     */

    function listingItems() public view virtual returns (Listing[] memory) {
        uint256 totalItems = _listingId.current();

        uint256 indexCounter = 0;
        uint256 count = 0;

        for (uint256 index = 0; index < totalItems; index++) {
            if (getListingStatus(index + 1) == true) {
                count += 1;
            }
        }

        Listing[] memory items = new Listing[](count);

        for (uint256 index = 0; index < totalItems; index++) {
            if (getListingStatus(index + 1) == true) {
                Listing storage currentItem = _listings[index + 1];
                items[indexCounter] = currentItem;
                indexCounter++;
            }
        }

        return items;
    }
}
