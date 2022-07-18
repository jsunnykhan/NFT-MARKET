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
        
        return newItemId;
    }

   
}
