// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

interface IPleaseWallet {
    function init(
        address _initialSigner,
        address _guardianManager,
        address[] calldata _initialGuardians,
        uint256 _initialThreshhold
    ) external;

    function primarySigner() external view returns (address);
}
