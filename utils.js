const { ethers } = require("ethers");

async function signUserOp(userOp, signer, entryPointAddress, chainId) {
    const packed = ethers.utils.defaultAbiCoder.encode(
        ["address", "uint256", "bytes32", "bytes32", "uint256", "uint256", "uint256", "uint256", "uint256", "bytes32"],
        [userOp.sender, userOp.nonce, ethers.utils.keccak256(userOp.initCode), ethers.utils.keccak256(userOp.callData), userOp.callGasLimit, userOp.verificationGasLimit, userOp.preVerificationGas, userOp.maxFeePerGas, userOp.maxPriorityFeePerGas, ethers.utils.keccak256(userOp.paymasterAndData)]
    );
    
    const userOpHash = ethers.utils.keccak256(
        ethers.utils.defaultAbiCoder.encode(
            ["bytes32", "address", "uint256"],
            [ethers.utils.keccak256(packed), entryPointAddress, chainId]
        )
    );

    // Sign the hash
    const signature = await signer.signMessage(ethers.utils.arrayify(userOpHash));
    userOp.signature = signature;
    
    return userOp;
}

module.exports = { signUserOp };
