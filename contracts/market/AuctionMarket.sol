// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/utils/Counters.sol";
import "../token/ERC721/ERC721.sol";
import "../utils/Context.sol";

contract AuctionMarket is Context {
    using Counters for Counters.Counter;
    //make private
    Counters.Counter public _itemID;

    address public owner;
    uint256 public listingPrice;

    struct AuctionItem {
        uint256 auctionId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable creator;
        uint256 auctionEndTime;
        uint256 baseValue;
        address highestBidder;
        uint256 highestBid;
        bool auctionEnded;
        bool sold;
    }

    // make private
    mapping(uint256 => AuctionItem) public auctionItems;

    constructor() {
        owner = _msgSender();
        listingPrice = .01 ether;
    }

    // events
    event AuctionStarted(
        uint256 indexed auctionId,
        address payable indexed seller,
        uint256 indexed tokenId,
        uint256 auctionEndTime,
        uint256 baseValue
    );

    event Bid(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 indexed bid,
        uint256 biddingTime
    );

    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed highestBidder,
        uint256 highestBid,
        uint256 indexed tokenId,
        address seller
    );

    // functions

    /**
     * @dev Create an auction for an NFT
     * @param _nftContract The address of the NFT contract
     * @param _tokenId The id of the NFT
     * @param _creator The address of the creator(the person minting the NFT)
     * @param _biddingTime The auction duration
     * @param _baseValue The base value of the NFT
     */
    function startAuction(
        address _nftContract,
        uint256 _tokenId,
        address payable _creator,
        uint256 _biddingTime,
        uint256 _baseValue
    ) public payable {
        require(_baseValue > 0, "Price must be at least 1wei");
        require(
            msg.value >= listingPrice,
            "You have to pay 0.01 ether to create Nft"
        );

        uint256 auctionId = _itemID.current();
        auctionItems[auctionId] = AuctionItem(
            auctionId,
            _nftContract,
            _tokenId,
            payable(_msgSender()),
            _creator,
            block.timestamp + _biddingTime,
            _baseValue,
            address(0),
            0,
            false,
            false
        );

        _itemID.increment();
        /**
         * @change
         * instead of transferring to the contract, need to just list
         */
        // IERC721(_nftContract).transferFrom(_msgSender(), address(this), _tokenId);

        IERC721(_nftContract).setApprovalForAll(address(this), true);

        emit AuctionStarted(
            auctionId,
            payable(_msgSender()),
            _tokenId,
            _biddingTime,
            _baseValue
        );
    }

    /**
     * @dev Bid on an auction
     * @param _auctionId The id of the auction
     * @param _amount The bid amount
     * @param _tokenAddress The address of the ERC-20 contract
     */
    function bid(
        uint256 _auctionId,
        uint256 _amount,
        address _tokenAddress
    ) public {
        if (block.timestamp > auctionItems[_auctionId].auctionEndTime) {
            revert("AUC101: Auction has already ended");
        }

        if (_amount <= auctionItems[_auctionId].baseValue) {
            revert("AUC102: Bid cannot be less than base value");
        }

        if (_amount <= auctionItems[_auctionId].highestBid) {
            revert("AUC103: These already a higher or equal bid");
        }

        uint256 currentAllowance = IVSCoins(_tokenAddress).allowance(
            _msgSender(),
            address(this)
        );

        if (currentAllowance <= 0) {
            IVSCoins(_tokenAddress).approve(address(this), _amount);
            if (auctionItems[_auctionId].highestBid != 0) {
                IVSCoins(_tokenAddress).decreaseAllowance(
                    address(this),
                    auctionItems[_auctionId].highestBid,
                    auctionItems[_auctionId].highestBidder
                );
            }
        } else {
            if (_msgSender() == auctionItems[_auctionId].highestBidder) {
                IVSCoins(_tokenAddress).decreaseAllowance(
                    address(this),
                    auctionItems[_auctionId].highestBid,
                    auctionItems[_auctionId].highestBidder
                );

                IVSCoins(_tokenAddress).increaseAllowance(
                    address(this),
                    _amount,
                    _msgSender()
                );
            } else {
                IVSCoins(_tokenAddress).increaseAllowance(
                    address(this),
                    _amount,
                    _msgSender()
                );
                if (auctionItems[_auctionId].highestBid != 0) {
                    IVSCoins(_tokenAddress).decreaseAllowance(
                        address(this),
                        auctionItems[_auctionId].highestBid,
                        auctionItems[_auctionId].highestBidder
                    );
                }
            }
        }

        auctionItems[_auctionId].highestBidder = _msgSender();
        auctionItems[_auctionId].highestBid = _amount;

        emit Bid(_auctionId, _msgSender(), _amount, block.timestamp);
    }

    /**
     * @dev End an auction
     * @param _auctionId The id of the auction
     * @param _tokenAddress The address of the ERC-20 contract
     */
    function auctionEnd(uint256 _auctionId, address _tokenAddress) public {
        /*
	    if (block.timestamp < auctionItems[_auctionId].auctionEndTime) {
            revert("AUC105: Auction has not ended yet");
        }
       	*/

        if (_msgSender() != owner) {
            revert("AUC105: Only owner can end the auction");
        }

        if (auctionItems[_auctionId].auctionEnded) {
            revert("AUC106: The function has already been called");
        }

        uint256 tokenId = auctionItems[_auctionId].tokenId;
        uint256 transferAmount = auctionItems[_auctionId].highestBid;
        address seller = auctionItems[_auctionId].seller;
        address highestBidder = auctionItems[_auctionId].highestBidder;
        address nftContract = auctionItems[_auctionId].nftContract;

        if (auctionItems[_auctionId].highestBidder == address(0)) {
            auctionItems[_auctionId].auctionEnded = true;
            emit AuctionEnded(
                _auctionId,
                highestBidder,
                transferAmount,
                tokenId,
                seller
            );
        }

        IVSCoins(_tokenAddress).transferFrom(
            highestBidder,
            seller,
            transferAmount
        );

        IERC721(nftContract).transferFrom(seller, highestBidder, tokenId);

        auctionItems[_auctionId].sold = true;
        auctionItems[_auctionId].auctionEnded = true;

        emit AuctionEnded(
            _auctionId,
            highestBidder,
            transferAmount,
            tokenId,
            seller
        );
    }

    // Future Feature
    // function terminateAuction(uint256 _auctionId) public {
    //     address seller = auctionItems[_auctionId].seller;
    //     bool auctionEnded = auctionItems[_auctionId].auctionEnded;
    //     if(seller != tx.origin /* _msgSender() */ && !auctionEnded){

    //     }
    // }

    // fetch functions

    function getAllAuctionItems() public view returns (AuctionItem[] memory) {
        uint256 totalItemCount = _itemID.current();

        AuctionItem[] memory _auctionItems = new AuctionItem[](totalItemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (!auctionItems[i].auctionEnded) {
                _auctionItems[i] = auctionItems[i];
            }
        }

        return _auctionItems;
    }

    function getUserAuctionItems() public view returns (AuctionItem[] memory) {
        uint256 totalItemCount = _itemID.current();

        AuctionItem[] memory _auctionItems = new AuctionItem[](totalItemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (auctionItems[i].seller == _msgSender()) {
                _auctionItems[i] = auctionItems[i];
            }
        }

        return _auctionItems;
    }

    function getSingleAuctionItem(uint256 auctionId)
        external
        view
        returns (AuctionItem memory)
    {
        return auctionItems[auctionId];
    }

    function getListingPrice() external view returns (uint256) {
        return listingPrice;
    }
}

// vs coin interface
interface IVSCoins {
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);

    function transferTo(address to, uint256 amount) external returns (bool);

    function transfer(address recipient, uint256 amount)
        external
        returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function decreaseAllowance(
        address spender,
        uint256 subtractedValue,
        address highestBidder
    ) external returns (bool);

    function increaseAllowance(
        address spender,
        uint256 addedValue,
        address highestBidder
    ) external returns (bool);
}
