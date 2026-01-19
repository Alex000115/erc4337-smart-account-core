// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./SmartAccount.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract SmartAccountFactory {
    IEntryPoint public entryPoint;

    constructor(IEntryPoint _entryPoint) {
        entryPoint = _entryPoint;
    }

    // Deploys a new wallet deterministically using a 'salt'
    function createAccount(address owner, uint256 salt) external returns (address ret) {
        address addr = getAddress(owner, salt);
        uint256 codeSize = addr.code.length;
        
        if (codeSize > 0) {
            return addr;
        }

        ret = address(new SmartAccount{salt: bytes32(salt)}(entryPoint, owner));
    }

    // Calculate address without deploying
    function getAddress(address owner, uint256 salt) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(SmartAccount).creationCode,
            abi.encode(entryPoint, owner)
        );
        
        return Create2.computeAddress(bytes32(salt), keccak256(bytecode), address(this));
    }
}
