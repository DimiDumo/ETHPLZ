// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract PleaseWallet {
    using ECDSA for bytes32;

    uint256 internal constant BASIC_SECURITY_DELAY = 2 days;
    uint256 internal constant HIGH_SECURITY_DELAY = 7 days;

    uint256 internal constant ACTION_IS_NEW = 0;
    uint256 internal constant ACTION_EXECUTED = 1;

    // constants
    bytes32 public WALLET_UUID;

    // wallet state
    address public primarySigner;
    uint256 public walletNonce;
    mapping(bytes32 => uint256) public actionEarliestSettle;

    // wallet config
    mapping(bytes4 => uint256) public actionDelay;
    mapping(bytes4 => bool) public actionInstant;

    event ActionQueued(bytes32 indexed actionHash, uint256 earliestSettle);
    event ActionInvalidated(bytes32 indexed actionHash);
    event ExecutionResult(bytes result);

    constructor(address _initialSigner) {
        // ensure uuid is different between chains, versions and individual wallets
        WALLET_UUID = keccak256(abi.encode("PleaseWallet v0.1 UUID", block.chainid, address(this)));
        primarySigner = _initialSigner;
        actionInstant[PleaseWallet.queueAction.selector] = true;
        actionInstant[PleaseWallet.invalidateAction.selector] = true;
    }

    modifier onlyWallet() {
        require(msg.sender == address(this), "PleaseWallet: Not wallet");
        _;
    }

    function queueAction(
        bytes4 _selector,
        bytes calldata _functionData,
        uint256 _nonce
    ) external onlyWallet {
        require(!actionInstant[_selector], "PleaseWallet: Cannot be queued");
        bytes32 actionHash = _createNonInstantActionHash(
            abi.encodePacked(_selector, _functionData),
            _nonce
        );
        require(actionEarliestSettle[actionHash] == ACTION_IS_NEW, "PleaseWallet: Action not new");
        uint256 earliestSettle = block.timestamp + actionDelay[_selector];
        actionEarliestSettle[actionHash] = earliestSettle;
        emit ActionQueued(actionHash, earliestSettle);
    }

    function invalidateAction(bytes32 _actionHash) external onlyWallet {
        require(actionEarliestSettle[_actionHash] != ACTION_EXECUTED, "PleaseWallet: Action done");
        actionEarliestSettle[_actionHash] = ACTION_EXECUTED;
        emit ActionInvalidated(_actionHash);
    }

    function executeCall(
        bytes4 _selector,
        bytes calldata _functionData,
        bytes calldata _signature,
        uint256 _nonce
    ) external {
        bytes memory callData = abi.encodePacked(_selector, _functionData);
        bytes32 actionHash;
        if (actionInstant[_selector]) {
            actionHash = keccak256(abi.encode(WALLET_UUID, callData));
        } else {
            require(_nonce == walletNonce++, "PleaseWallet: Invalid nonce");
            actionHash = _createNonInstantActionHash(callData, _nonce);
            uint256 earliestSettle = actionEarliestSettle[actionHash];
            require(earliestSettle > ACTION_EXECUTED, "PleaseWallet: Action not pending");
            require(block.timestamp >= earliestSettle, "PleaseWallet: Action not ready");
            actionEarliestSettle[actionHash] = ACTION_EXECUTED;
        }
        address callSigner = actionHash.toEthSignedMessageHash().recover(_signature);
        require(callSigner == primarySigner, "PleaseWallet: Not primary key");
        _selfCall(callData);
    }

    function _createNonInstantActionHash(bytes memory _callData, uint256 _nonce)
        internal
        view
        returns (bytes32)
    {
        return keccak256(abi.encode(WALLET_UUID, _callData, primarySigner, _nonce));
    }

    function _selfCall(bytes memory _callData) internal {
        (bool success, bytes memory result) = address(this).call(_callData);
        require(success, string(result));
        emit ExecutionResult(result);
    }
}
