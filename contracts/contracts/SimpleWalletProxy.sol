// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/proxy/Proxy.sol";

contract SimpleWalletProxy is Proxy {
    // keccak256("eip1967.proxy.implementation") - 1
    bytes32 internal constant _IMPLEMENTATION_SLOT =
        0x360894a13ba1a3210667c828492db98dca3e2076cc3735a920a3ca505d382bbc;

    constructor(address _initialImplementation) {
        assembly {
            sstore(_IMPLEMENTATION_SLOT, _initialImplementation)
        }
    }

    function getImplementation() external view returns (address) {
        return _implementation();
    }

    function _implementation() internal view override returns (address implementation) {
        assembly {
            implementation := sload(_IMPLEMENTATION_SLOT)
        }
    }
}
