// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

import "../utils/Ownable.sol";

contract NFTMarket is ReentrancyGuard, Ownable {
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
        bool isErc721; // type of token true/false
        State state; // token State Listed or sold
        uint256 price; // price of this token
    }

    mapping(uint256 => Listing) private _listings;

    event listingCreated(
        uint256 indexed listingId,
        address collectionAddress,
        address payable creator,
        address payable owner,
        bool isErc721,
        uint256 price
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
        uint256 listingId,
        uint256 tokenId,
        address collectionAddress,
        address payable creator,
        address payable owner,
        bool isErc721,
        uint256 price
    ) public virtual returns (bool success) {
        require(
            _listings[listingId].listingId != listingId,
            "Item is already listed"
        );
        if (isErc721) {
            Listing memory listing = Listing(
                listingId,
                tokenId,
                collectionAddress,
                creator,
                owner,
                isErc721,
                State.LISTED,
                price
            );
            _listings[listingId] = listing;

            emit listingCreated(
                listingId,
                collectionAddress,
                creator,
                owner,
                isErc721,
                price
            );
            return true;
        }
    }

    function deleteListingItem(uint256 listingId)
        public
        virtual
        returns (bool)
    {
        delete _listings[listingId];
        return true;
    }
}
