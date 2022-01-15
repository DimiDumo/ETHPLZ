// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "./ISelfUpgradeable.sol";

interface IPleaseWallet is ISelfUpgradeable {
    function init(address _initialSigner, address _guardianManager) external;
}
