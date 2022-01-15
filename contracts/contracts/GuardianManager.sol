// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./IGuardianManager.sol";

contract GuardianManager is IGuardianManager {
    using SignatureChecker for address;
    using ECDSA for bytes32;

    mapping(address => RecoverySettings) public override recoverySettingsOf;
    mapping(address => mapping(bytes32 => bool)) public saltUsed;

    bytes32 public immutable GUARDIAN_CALL_PREFIX;

    constructor() {
        GUARDIAN_CALL_PREFIX = keccak256(
            abi.encode("PleaseWallet GuardianManager v0.1", block.chainid, address(this))
        );
    }

    function isGuardianFor(address _wallet, address _guardian) public view override returns (bool) {
        RecoverySettings storage settings = recoverySettingsOf[_wallet];
        return settings.isGuardianAt[_guardian] == settings.currentIteration;
    }

    function updateSettings(address[] calldata _newGuardians, uint256 _newThreshhold)
        external
        override
    {
        require(_newThreshhold <= _newGuardians.length, "GuardMan: Threshhold too high");
        RecoverySettings storage settings = recoverySettingsOf[msg.sender];
        uint256 currentIteration = ++settings.currentIteration;
        settings.guardianThreshhold = uint128(_newThreshhold);
        for (uint256 i; i < _newGuardians.length; i++) {
            settings.isGuardianAt[_newGuardians[i]] = uint256(currentIteration);
        }
        emit SettingsUpdated(msg.sender, currentIteration, _newGuardians.length);
    }

    function executeGuardianCall(
        address _targetWallet,
        GuardianInput[] calldata _guardians,
        bytes calldata _callData
    ) external override {
        bytes32 callHash = keccak256(abi.encode(_targetWallet, _callData));
        RecoverySettings storage settings = recoverySettingsOf[_targetWallet];
        uint256 currentIteration = settings.currentIteration;
        uint256 threshhold = settings.guardianThreshhold;
        require(currentIteration > 0, "GuardMan: No settings");
        require(threshhold <= _guardians.length, "GuardMan: Insufficient guardians");

        /* O(n^2) algorithm used because O(n) solution would require storage
           mappings which overall would be more expensive */
        for (uint256 i; i < _guardians.length; i++) {
            GuardianInput calldata guardianInp = _guardians[i];
            address guardian = guardianInp.guardian;
            require(settings.isGuardianAt[guardian] == currentIteration, "GuardMan: Not guardian");
            for (uint256 j = i + 1; j < _guardians.length; j++) {
                require(guardian != _guardians[j].guardian, "GuardMan: Duplicate guardian");
            }

            bytes32 salt = guardianInp.salt;
            if (salt == bytes32(0)) {
                require(!saltUsed[guardian][salt], "GuardMan: Salt already used");
                bytes32 guardianAuthHash = keccak256(
                    abi.encode(GUARDIAN_CALL_PREFIX, callHash, salt)
                ).toEthSignedMessageHash();
                require(
                    guardian.isValidSignatureNow(guardianAuthHash, guardianInp.signature),
                    "GuardMan: Signature not valid"
                );
                saltUsed[guardian][salt] = true;
            } else {
                require(guardian == msg.sender, "GuardMan: Not caller");
            }
        }

        _targetWallet.call(_callData);
    }
}
