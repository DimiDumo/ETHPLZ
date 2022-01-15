// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

interface IGuardianManager {
    struct RecoverySettings {
        uint128 currentIteration;
        uint128 guardianThreshhold;
        mapping(address => uint256) isGuardianAt;
    }

    struct GuardianInput {
        address guardian;
        bytes32 salt;
        bytes signature;
    }

    event SettingsUpdated(address indexed wallet, uint256 indexed iteration, uint256 guardianCount);

    function recoverySettingsOf(address _wallet)
        external
        view
        returns (uint128 currentSettingsIteration, uint128 guardianThreshhold);

    function isGuardianFor(address _wallet, address _guardian) external view returns (bool);

    function updateSettings(address[] calldata _newGuardianList, uint256 _newThreshhold) external;

    function executeGuardianCall(
        address _targetWallet,
        GuardianInput[] calldata _guardians,
        bytes calldata _callData
    ) external;
}
