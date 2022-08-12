// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;
import "../token/ERC20/IERC20.sol";
import "../token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "../utils/Ownable.sol";
import "../utils/Context.sol";

contract NFTMarket is ReentrancyGuard, Ownable, Context {
    using Counters for Counters.Counter;
    Counters.Counter private _listingId;

    uint256 private _marketFee;

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
        State state; // token State Listed or sold
        uint256 price; // price of this token
    }

    mapping(uint256 => Listing) private _listings;

    event listed(
        uint256 indexed listingId,
        address collectionAddress,
        address payable creator,
        address payable owner,
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
        string name,
        string symbol,
        address collectionAddress,
        address indexed ownerOf
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
        require(_owner == msg.sender, "This token not belongs to this address");
        IERC721(collectionAddress).approve(address(this), tokenId); // collenction should be tx.origin

        Listing memory listing = Listing(
            newListingId,
            tokenId,
            collectionAddress,
            payable(_owner),
            payable(_owner),
            State.LISTED,
            price
        );
        _listings[newListingId] = listing;

        emit listed(
            newListingId,
            collectionAddress,
            payable(_owner),
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
        string memory name,
        string memory symbol,
        address collectionAddress,
        address ownerOf
    ) public virtual {
        emit CollectionCreated(name, symbol, collectionAddress, ownerOf);
    }
}
