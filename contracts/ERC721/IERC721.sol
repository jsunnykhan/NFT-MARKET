// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IERC20  is IERC165 {

    event Transfer(
        address indexed sender,
        address indexed recipient,
        uint256 indexed tokenId
    );

    event Approval(
        address indexed sender,
        address indexed recipient,
        uint256 indexed tokenId
    );

    event ApprovalForAll(
        address indexed sender,
        address indexed recipient,
        bool approved
    );

    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function safeTransferFrom(
        address sender,
        address recipient,
        uint256 tokenId,
        bytes calldata data
    ) external;

    function safeTransferFrom(
        address sender,
        address recipient,
        uint256 tokenId
    ) external;

    function transferFrom(
        address sender,
        address recipient,
        uint256 tokenId
    ) external;

    function approve(address recipient, uint256 tokenId) external;

    function setApprovalForAll(address recipient, uint256 tokenId) external;

    function getApproved(uint256 tokenId)
        external
        view
        returns (address operator);

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);
}
