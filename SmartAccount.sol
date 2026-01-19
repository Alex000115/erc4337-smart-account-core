// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SmartAccount is BaseAccount {
    using ECDSA for bytes32;

    address public owner;
    IEntryPoint private immutable _entryPoint;

    constructor(IEntryPoint anEntryPoint, address _owner) {
        _entryPoint = anEntryPoint;
        owner = _owner;
    }

    function entryPoint() public view override returns (IEntryPoint) {
        return _entryPoint;
    }

    // Validates the signature of the UserOp
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal view override returns (uint256)
    {
        bytes32 hash = userOpHash.toEthSignedMessageHash();
        if (owner != hash.recover(userOp.signature)) {
            return SIG_VALIDATION_FAILED;
        }
        return 0;
    }

    // Allows the entryPoint to execute calls
    function execute(address dest, uint256 value, bytes calldata func) external {
        require(msg.sender == address(entryPoint()), "account: not EntryPoint");
        (bool success, ) = dest.call{value: value}(func);
        require(success, "execution failed");
    }

    // Allow receiving ETH
    receive() external payable {}
}
