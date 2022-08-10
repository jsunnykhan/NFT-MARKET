// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

abstract contract Ownable {
    address private _owner;

    event ownerShipTransfer(address indexed oldOwner, address indexed newOwner);

    constructor() {
        _owner = msg.sender;
        emit ownerShipTransfer(address(0), msg.sender);
    }

    function getOwner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(getOwner() == msg.sender, "Caller is not the owner");
        _;
    }

    function transferOwnerShip(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "New owner address Zero address");
        emit ownerShipTransfer(_owner, newOwner);
        _owner = newOwner;
    }
}
