// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract MyToken {
    address private _admin;

    string private _name;
    string private _symbol;

    uint256 private _totalSupply;

    mapping(address => uint256) private _balance;

    function initialize() external {
        _name = "MyToken";
        _symbol = "VS";
        _mint(msg.sender, 100000 * 10**18);
        _admin = msg.sender;
    }

    function mintToken(uint256 amount) public {
        require(msg.sender == _admin, "only admin can mint");

        _mint(msg.sender, amount);
    }

    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (uint256) {
        return _balance[account];
    }

    function transfer(address to, uint256 amount) public {
        require(
            _balance[msg.sender] >= amount,
            "Not enough balance to transfer"
        );
        _transfer(msg.sender, to, amount);
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public {
        require(_balance[from] >= amount, "Not enough balance to transfer");
        _transfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal virtual {
        require(to != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        _balance[to] += amount;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) private {
        _balance[from] -= amount;
        _balance[to] += amount;
    }
}
