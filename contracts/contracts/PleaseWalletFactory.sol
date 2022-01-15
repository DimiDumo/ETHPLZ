// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SimpleWalletProxy.sol";
import "./IPleaseWallet.sol";

contract PleaseWalletFactory is Ownable {
    address public defaultImplementation;
    address public defaultGuardianManager;

    event NewWalletCreated(address walletAddress);

    constructor(address _defaultImplementation, address _defaultGuardianManager) Ownable() {
        defaultImplementation = _defaultImplementation;
        defaultGuardianManager = _defaultGuardianManager;
    }

    function setDefaultImplementation(address _defaultImplementation) external onlyOwner {
        defaultImplementation = _defaultImplementation;
    }

    function setGuardianManager(address _defaultGuardianManager) external onlyOwner {
        defaultGuardianManager = _defaultGuardianManager;
    }

    function createDefaultWallet(address _initialSigner) external returns (address) {
        address[] memory initialGuardians = new address[](1);
        initialGuardians[0] = owner();
        SimpleWalletProxy proxy = new SimpleWalletProxy(defaultImplementation);
        IPleaseWallet(address(proxy)).init(
            _initialSigner,
            defaultGuardianManager,
            initialGuardians,
            1
        );
        emit NewWalletCreated(address(proxy));
        return address(proxy);
    }
}
