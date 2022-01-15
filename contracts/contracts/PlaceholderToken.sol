// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlaceholderToken is ERC20, Ownable {
    constructor() ERC20("USDD", "Super real definitely legit USD") {}

    function issueTokensTo(address _recipient, uint256 _amount) external onlyOwner {
        _mint(_recipient, _amount);
    }
}
