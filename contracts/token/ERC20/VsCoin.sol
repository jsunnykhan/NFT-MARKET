// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "./IERC20.sol";
import "../../utils/Context.sol";

contract VSCoin is IERC20, Context {
    address payable private _admin;
    string private _name;
    string private _symbol;
    uint256 private _totalSupply;

    mapping(address => uint256) private _balance;
    mapping(address => bytes32) private swapHash;

    mapping(address => mapping(address => uint256)) private _allowances;

    // function initialize() external {
    //     _name = "VS Coin";
    //     _symbol = "VSC";
    //     _mint(_msgSender(), 100000 * 10**18);
    //     _admin = _msgSender();
    // }

    constructor() {
        _name = "VS Coin";
        _symbol = "VSC";
        _mint(_msgSender(), 1000000 * 10**18);
        _admin = payable(_msgSender());
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
        require(_balance[_origin()] >= amount, "ERC20- Insufficient Balance");
        _transfer(_origin(), recipient, amount);

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
        uint256 balance = _balance[_origin()];
        require(balance >= amount, "ERC20: Not efficient money");
        _approval(_origin(), spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 currentAllowance = _allowances[sender][_origin()];
        require(
            currentAllowance >= amount,
            "ERC20: transfer amount exceeds allowance"
        );

        _transfer(sender, _origin(), amount);

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

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue,
        address highestBidder
    ) public virtual returns (bool) {
        address owner = highestBidder;
        uint256 currentAllowance = allowance(owner, spender);
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero not allowed"
        );

        unchecked {
            _approval(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function increaseAllowance(
        address spender,
        uint256 addedValue,
        address highestBidder
    ) public virtual returns (bool) {
        address owner = highestBidder;
        uint256 currentAllowance = allowance(owner, spender);
        _approval(owner, spender, currentAllowance + addedValue);
        return true;
    }

    function swapEthToVs(address to, uint256 amount)
        public
        payable
        returns (bytes32)
    {
        require(
            _admin != _msgSender(),
            "You Cannot Buy this Coin At this moment"
        );
        bytes32 kHash = keccak256(abi.encodePacked(msg.value, amount, to));
        swapHash[_origin()] = kHash;
        payable(address(_admin)).transfer(msg.value);
        return kHash;
    }

    function verifySwapHash(
        uint256 eth,
        address to,
        uint256 amount
    ) public returns (bool) {
        require(
            swapHash[to] == keccak256(abi.encodePacked(eth, amount, to)),
            "Invalid hash no trace found"
        );
        transfer(to, amount);
        delete swapHash[to];
        return true;
    }
}
