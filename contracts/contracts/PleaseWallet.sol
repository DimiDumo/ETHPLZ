// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Upgrade.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/utils/ERC721HolderUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC1155/utils/ERC1155HolderUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./IGuardianManager.sol";
import "./IPleaseWallet.sol";

contract PleaseWallet is
    IPleaseWallet,
    Initializable,
    ERC1967Upgrade,
    ERC721HolderUpgradeable,
    ERC1155HolderUpgradeable
{
    using ECDSA for bytes32;
    using Address for address payable;

    uint256 internal constant UNREGISTERED = 0;
    uint256 internal constant NO_DELAY = 1;
    // TODO: change delays to full length for production deploy
    uint256 internal constant BASIC_SECURITY_DELAY = 2 minutes;
    uint256 internal constant HIGH_SECURITY_DELAY = 5 minutes;

    uint256 internal constant ACTION_IS_NEW = 0;
    uint256 internal constant ACTION_EXECUTED = 1;

    // constants
    bytes32 public WALLET_UUID;

    // wallet state
    bool internal withinSelfCall;
    address public override primarySigner;
    mapping(bytes32 => uint256) public actionEarliestSettle;

    // wallet config
    mapping(bytes4 => uint256) public actionDelay;
    IGuardianManager public guardianManager;

    event ActionQueued(bytes32 indexed actionHash, bytes callData, uint256 earliestSettle);
    event ActionInvalidated(bytes32 indexed actionHash);
    event ExecutionResult(bytes result);
    event UpdatePrimarySigner(address indexed prevPrimarySigner, address indexed newPrimarySigner);

    function init(
        address _initialSigner,
        address _guardianManager,
        address[] calldata _initialGuardians,
        uint256 _initialThreshhold
    ) external override initializer {
        __ERC721Holder_init();
        __ERC1155Holder_init();
        // ensure uuid is different between chains, versions and individual wallets
        WALLET_UUID = keccak256(abi.encode("PLZWallet v0.1 UUID", block.chainid, address(this)));
        primarySigner = _initialSigner;

        guardianManager = IGuardianManager(_guardianManager);
        IGuardianManager(_guardianManager).updateSettings(_initialGuardians, _initialThreshhold);

        actionDelay[PleaseWallet.queueAction.selector] = NO_DELAY;
        actionDelay[PleaseWallet.invalidateAction.selector] = NO_DELAY;

        actionDelay[PleaseWallet.sendNative.selector] = BASIC_SECURITY_DELAY;
        actionDelay[PleaseWallet.sendER20.selector] = BASIC_SECURITY_DELAY;
        actionDelay[PleaseWallet.sendER721.selector] = BASIC_SECURITY_DELAY;
        actionDelay[PleaseWallet.sendERC1155.selector] = BASIC_SECURITY_DELAY;

        actionDelay[PleaseWallet.upgradeSelfTo.selector] = HIGH_SECURITY_DELAY;
        actionDelay[PleaseWallet.updateRecoverySettings.selector] = HIGH_SECURITY_DELAY;
    }

    modifier onlyWallet() {
        require(msg.sender == address(this), "PLZWallet: Not wallet");
        require(!withinSelfCall, "PLZWallet: Nested self call");
        withinSelfCall = true;
        _;
        withinSelfCall = false;
    }

    modifier onlyGuardian() {
        require(msg.sender == address(guardianManager), "PLZWallet: Not guardian");
        _;
    }

    receive() external payable {}

    function upgradeSelfTo(address _newImplementation, bytes calldata _initCallData)
        external
        onlyWallet
    {
        _upgradeToAndCall(_newImplementation, _initCallData, false);
    }

    function sendNative(address payable _recipient, uint256 _amount) external onlyWallet {
        _recipient.sendValue(_amount);
    }

    function sendER20(
        address _token,
        address _recipient,
        uint256 _amount
    ) external onlyWallet {
        IERC20(_token).transfer(_recipient, _amount);
    }

    function sendER721(
        address _token,
        address _recipient,
        uint256 _tokenId
    ) external onlyWallet {
        IERC721(_token).safeTransferFrom(address(this), _recipient, _tokenId);
    }

    function sendERC1155(
        address _token,
        address _recipient,
        uint256 _tokenId,
        uint256 _amount
    ) external onlyWallet {
        IERC1155(_token).safeTransferFrom(address(this), _recipient, _tokenId, _amount, "");
    }

    function resetPrimarySigner(address _newPrimarySigner) external onlyGuardian {
        address prevPrimarySigner = primarySigner;
        primarySigner = _newPrimarySigner;
        emit UpdatePrimarySigner(prevPrimarySigner, _newPrimarySigner);
    }

    function updateRecoverySettings(address[] calldata _newGuardians, uint256 _newThreshhold)
        external
        onlyWallet
    {
        guardianManager.updateSettings(_newGuardians, _newThreshhold);
    }

    function queueAction(bytes4 _selector, bytes calldata _functionData) external onlyWallet {
        require(!isInstant(_selector), "PLZWallet: Cannot be queued");
        bytes memory callData = abi.encodePacked(_selector, _functionData);
        bytes32 actionHash = _createNonInstantActionHash(callData, block.number);
        require(actionEarliestSettle[actionHash] == ACTION_IS_NEW, "PLZWallet: Action not new");
        uint256 earliestSettle = block.timestamp + actionDelay[_selector];
        actionEarliestSettle[actionHash] = earliestSettle;
        emit ActionQueued(actionHash, callData, earliestSettle);
    }

    function invalidateAction(bytes32 _actionHash) external onlyWallet {
        require(actionEarliestSettle[_actionHash] != ACTION_EXECUTED, "PLZWallet: Action done");
        actionEarliestSettle[_actionHash] = ACTION_EXECUTED;
        emit ActionInvalidated(_actionHash);
    }

    function executeCall(
        bytes4 _selector,
        bytes calldata _functionData,
        bytes calldata _signature,
        uint256 _submittedBlock
    ) external {
        require(!isUnregistered(_selector), "PLZWallet: Unregistered method");
        bytes memory callData = abi.encodePacked(_selector, _functionData);
        bytes32 actionHash;
        if (isInstant(_selector)) {
            actionHash = keccak256(abi.encode(WALLET_UUID, callData));
        } else {
            actionHash = _createNonInstantActionHash(callData, _submittedBlock);
            uint256 earliestSettle = actionEarliestSettle[actionHash];
            require(earliestSettle > ACTION_EXECUTED, "PLZWallet: Action not pending");
            require(block.timestamp >= earliestSettle, "PLZWallet: Action not ready");
            actionEarliestSettle[actionHash] = ACTION_EXECUTED;
        }
        address callSigner = actionHash.toEthSignedMessageHash().recover(_signature);
        require(callSigner == primarySigner, "PLZWallet: Not primary key");
        _selfCall(callData);
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function isUnregistered(bytes4 _actionSelector) public view returns (bool) {
        return actionDelay[_actionSelector] == UNREGISTERED;
    }

    function isInstant(bytes4 _actionSelector) public view returns (bool) {
        return actionDelay[_actionSelector] == NO_DELAY;
    }

    function _createNonInstantActionHash(bytes memory _callData, uint256 _submittedBlock)
        internal
        view
        returns (bytes32)
    {
        return keccak256(abi.encode(WALLET_UUID, _callData, primarySigner, _submittedBlock));
    }

    function _selfCall(bytes memory _callData) internal {
        (bool success, bytes memory result) = address(this).call(_callData);
        require(success, string(result));
        emit ExecutionResult(result);
    }
}
