// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "./IERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/IERC1155MetadataURI.sol";

contract ERC1155 is ERC165, IERC1155, IERC1155MetadataURI {
    string private _uri;

    mapping(uint256 => mapping(address => uint256)) private _balance;

    mapping(address => mapping(address => bool)) private _operatorApprovals;

    constructor(string memory newURI) {
        _setURI(newURI);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC165, IERC165)
        returns (bool)
    {
        return
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function _setURI(string memory newURI) internal virtual {
        _uri = newURI;
    }

    function balanceOfBatch(address[] calldata accounts, uint256[] calldata ids)
        public
        view
        virtual
        override
        returns (uint256[] memory)
    {
        require(
            accounts.length == ids.length,
            "ERC1155: accounts and ids length mismatch"
        );
        uint256[] memory batchBalance = new uint256[](accounts.length);
        for (uint256 index = 0; index < accounts.length; index++) {
            batchBalance[index] = balanceOf(accounts[index], ids[index]);
        }
        return batchBalance;
    }

    function balanceOf(address account, uint256 id_)
        public
        view
        virtual
        override
        returns (uint256)
    {
        require(
            account != address(0),
            "ERC1155: balance query for the zero address"
        );

        return _balance[id_][account];
    }

    function setApprovalForAll(address _operator, bool _approved)
        public
        view
        virtual
        override
    {
        _setApprovalForAll(msg.sender, _operator, _approved);
    }

    function _setApprovalForAll(
        address from,
        address to,
        bool _approve
    ) internal virtual {
        require(from != to, "ERC1155: setting approval status for self");
        _operatorApprovals[from][to] = _approve;
        emit ApprovalForAll(owner, operator, approved);
    }

    function isApprovedForAll(address _owner, address _operator)
        public
        view
        virtual
        override
        returns (bool)
    {
        return __operatorApprovals[_owner][_operator];
    }

    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes memory _data
    ) public view virtual override {
        require(
            _from == msg.sender || isApprovedForAll(from, to),
            "ERC1155: caller is not owner nor approved"
        );
        _safeTransferFrom(_from, _to, _id, _amount, _data);
    }

    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) public view virtual override {
        require(
            _from == msg.sender || isApprovedForAll(from, to),
            "ERC1155: caller is not owner nor approved"
        );
        _safeTransferBatchFrom(_from, _to, _ids, _values, _data);
    }

    function _safeTransferBatchFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) internal virtual {
        require(
            _ids.length == _value.length,
            "ERC1155: ids and amounts length mismatch"
        );
        require(_to != address(0), "ERC1155: transfer to the zero address");

        address operator = msg.sender;
        _beforeTokenTransfer(operator, from, to, ids, _values, data);

        for (uint256 index = 0; index < _ids.length; index++) {
            uint256 id = _ids[index];
            uint256 amount = _values[index];

            uint256 fromBalance = _balance[id][_from];

            require(
                fromBalance >= amount,
                "ERC1155: insufficient balance for transfer"
            );
            unchecked {
                _balance[id][_from] = fromBalance - amount;
            }
            _balance[id][_to] += amount;
        }

        emit TransferBatch(operator, from, to, ids, amounts);

        _afterTokenTransfer(operator, from, to, ids, amounts, data);

        _doSafeBatchTransferAcceptanceCheck(
            operator,
            from,
            to,
            ids,
            amounts,
            data
        );
    }

    function _safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _amount,
        bytes memory _data
    ) internal virtual {
        require(_to != address(0), "ERC1155: transfer to the zero address");
        address operator = msg.sender;

        uint256[] memory ids = _asSingletonArray(_id);
        uint256[] memory amount = _asSingletonArray(_amount);

        _beforeTokenTransfer(operator, from, to, ids, amounts, data);

        uint256 fromBalance = _balance[_id][_from];

        require(
            fromBalance >= _amount,
            "ERC1155: insufficient balance for transfer"
        );

        unchecked {
            _balance[_id][from] = fromBalance - _amount;
        }
        _balance[_id][_to] += amount;
        emit TransferSingle(operator, _from, _to, _id, _amount);

        //  _afterTokenTransfer(operator, from, to, ids, amounts, data);

        // _doSafeTransferAcceptanceCheck(operator, from, to, id, amount, data);
    }

    function _asSingletonArray(uint256 element)
        private
        pure
        returns (uint256[] memory)
    {
        uint256[] memory array = new uint256[](1);
        array[0] = element;

        return array;
    }
}
