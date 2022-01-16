// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "hardhat/console.sol";

/// @author Philippe Dumonet
contract SignatureValid {
    using ECDSA for bytes32;

    bytes public lastData;
    address public signer;

    function getSigner(
        bytes32 _walletUUID,
        bytes calldata _callData,
        bytes calldata _signature
    ) external {
        bytes memory wholeData = abi.encode(_walletUUID, _callData);
        lastData = wholeData;
        bytes32 actionHash = keccak256(wholeData);
        console.log("actionHash:", Strings.toHexString(uint256(actionHash)));
        signer = actionHash.toEthSignedMessageHash().recover(_signature);
    }
}
