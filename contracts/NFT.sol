// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _nftTokenId;
    Counters.Counter private _mintedTokenId;

    address _marketPlcaeAddress;

    struct MintedItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        bool sold;
    }

    mapping(uint256 => MintedItem) private _mintedNFT;

    constructor(address marketPlcaeAddress_) ERC721("Viv", "VS") {
        _marketPlcaeAddress = marketPlcaeAddress_;
    }

    // function initialize(address marketPlcaeAddress_) public initializer {
    //     _marketPlcaeAddress = marketPlcaeAddress_;
    // }

    function createNewToken(string memory tokenURI_)
        external
        payable
        returns (uint256)
    {
        _nftTokenId.increment();
        uint256 newItemId = _nftTokenId.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI_);
        setApprovalForAll(_marketPlcaeAddress, true);
        _storeMintedNFT(newItemId);
        console.log("Token Id", newItemId);
        return newItemId;
    }

    function _storeMintedNFT(uint256 tokenId) private {
        _mintedTokenId.increment();

        uint256 itemId = _mintedTokenId.current();

        _mintedNFT[itemId] = MintedItem(
            itemId,
            address(this),
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            false
        );
    }

    function getMintedNFT() public view returns (MintedItem[] memory) {
        uint256 totalItemCount = _mintedTokenId.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 index = 0; index < totalItemCount; index++) {
            if (_mintedNFT[index + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MintedItem[] memory items = new MintedItem[](itemCount);

        for (uint256 index = 0; index < totalItemCount; index++) {
            if (_mintedNFT[index + 1].seller == msg.sender) {
                uint256 currentId = _mintedNFT[index + 1].itemId;
                MintedItem storage currentItem = _mintedNFT[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
