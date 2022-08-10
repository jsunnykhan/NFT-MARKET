// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../token/ERC721/ERC721.sol";
import "../token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

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

    constructor(string memory name, string memory symble) ERC721(name, symble) {
        _ownerOfContract = msg.sender;
    }

    // function initialize(address marketPlcaeAddress_) public initializer {
    //     _marketPlcaeAddress = marketPlcaeAddress_;
    // }

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
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI_);
        _storeMintedNFT(newItemId);
        console.log("Token Id", newItemId);
        return newItemId;
    }

    function _storeMintedNFT(uint256 tokenId) private {
        _minted[tokenId] = MintedItem(
            address(this),
            tokenId,
            payable(msg.sender)
        );
    }
}
//     function getMintedNFT() public view returns (MintedItem[] memory) {
//         uint256 totalItemCount = _mintedTokenId.current();
//         uint256 itemCount = 0;
//         uint256 currentIndex = 0;

//         for (uint256 index = 0; index < totalItemCount; index++) {
//             if (_minted[index + 1].creator == msg.sender) {
//                 itemCount += 1;
//             }
//         }

//         MintedItem[] memory items = new MintedItem[](itemCount);

//         for (uint256 index = 0; index < totalItemCount; index++) {
//             if (_minted[index + 1].creator == msg.sender) {
//                 uint256 currentId = _minted[index + 1].tokenId;
//                 MintedItem storage currentItem = _minted[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }
// }
