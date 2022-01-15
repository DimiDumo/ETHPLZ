// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

interface ISelfUpgradeable {
    function upgradeSelfTo(address _newImplementation, bytes calldata _initCallData) external;
}
