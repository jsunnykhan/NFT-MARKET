// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "../token/ERC721/ERC721.sol";
import "../token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

abstract contract INFTMarket {
    function createCollectionNotification(
        string memory name,
        string memory symbol,
        address collectionAddress,
        address ownerOf
    ) public virtual;
}

contract Collection is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _nftTokenId;

    struct MintedItem {
        address nftContract;
        uint256 tokenId;
        address payable creator;
    }
    mapping(uint256 => MintedItem) private _minted;
    address private _ownerOfContract;

    // function initialize(address marketPlcaeAddress_) public initializer {
    //     _marketPlcaeAddress = marketPlcaeAddress_;
    // }
    constructor(
        string memory name,
        string memory symbol,
        address marketAddress
    ) ERC721(name, symbol) {
        _ownerOfContract = _msgSender();

        INFTMarket(marketAddress).createCollectionNotification(
            name,
            symbol,
            address(this),
            _ownerOfContract
        );
    }

    function creatorOf(uint256 tokenId) public view virtual returns (address) {
        return _minted[tokenId].creator;
    }

    function createToken(string memory tokenURI_)
        external
        payable
        returns (uint256)
    {
        _nftTokenId.increment();
        uint256 newItemId = _nftTokenId.current();
        _mint(_msgSender(), newItemId);
        _setTokenURI(newItemId, tokenURI_);
        _storeMintedNFT(newItemId);
        return newItemId;
    }

    function _storeMintedNFT(uint256 tokenId) private {
        _minted[tokenId] = MintedItem(
            address(this),
            tokenId,
            payable(_msgSender())
        );
    }
}