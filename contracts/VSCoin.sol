// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

contract VSCoin is IERC20 {
    address private _admin;
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    mapping(address => uint256) private _balance;

    mapping(address => mapping(address => uint256)) private _allowances;

    constructor() {
        _name = "VS Coin";
        _symbol = "VSC";
        _mint(tx.origin, 100000 * 10**18);
        _admin = tx.origin;
    }

    function totalSupply() public view virtual returns (uint256) {
        return _totalSupply;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function decimals() public view virtual returns (uint8) {
        return 18;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function balanceOf(address account) public view virtual returns (uint256) {
        return _balance[account];
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        _transfer(tx.origin, recipient, amount);

        return true;
    }

    function transferTo(address to, uint256 amount)
        public
        virtual
        returns (bool)
    {
        _transfer(tx.origin, to, amount);

        return true;
    }

    function allowance(address owner, address spender)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        address owner = tx.origin;
        uint256 balance = _balance[owner];
        require(balance >= amount, "ERC20: Not efficient money");
        _approval(owner, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = msg.sender;
        uint256 currentAllowance = _allowances[sender][spender];
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );

        _transfer(sender, recipient, amount);

        _approval(sender, recipient, currentAllowance - amount);

        return true;
    }

    function _mint(address recipient, uint256 amount) internal virtual {
        require(
            recipient != address(0),
            "ERC20: mint recipient the zero address"
        );
        _totalSupply += amount;
        _balance[recipient] += amount;
    }

    function _transfer(
        address sender,
        address recipient,
        uint256 amount
    ) private {
        require(
            sender != address(0),
            "ERC20: transfer sender the zero address"
        );
        require(
            recipient != address(0),
            "ERC20: transfer recipient the zero address"
        );
        unchecked {
            _balance[sender] -= amount;
            _balance[recipient] += amount;
        }
    }

    function _approval(
        address owner,
        address spender,
        uint256 amount
    ) internal {
        require(owner != address(0), "ERC20: approve sender the zero address");
        require(
            spender != address(0),
            "ERC20: approve recipient the zero address"
        );

        _allowances[owner][spender] = amount;
    }

    function increaseAllowance(
        address spender,
        uint256 addedValue,
        address highestBidder
    ) public virtual returns (bool) {
        address owner = highestBidder;
        console.log("Owner: ", owner);
        console.log("Spender: ", spender);
        console.log("Added Value: ", addedValue);
        _approval(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue,
        address highestBidder
    ) public virtual returns (bool) {
        address owner = highestBidder;
        console.log("Owner: ", owner);
        console.log("Spender: ", spender);
        console.log("Subtracted Value: ", subtractedValue);
        uint256 currentAllowance = allowance(owner, spender);
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        unchecked {
            _approval(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }
}
