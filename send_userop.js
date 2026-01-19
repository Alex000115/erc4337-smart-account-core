const { ethers } = require("hardhat");
const { FACTORY_ADDRESS, ENTRY_POINT_ADDRESS } = require("./config");
const { buildUserOp, signUserOp } = require("./utils");

async function main() {
    const [signer] = await ethers.getSigners();
    const entryPoint = await ethers.getContractAt("IEntryPoint", ENTRY_POINT_ADDRESS);
    const factory = await ethers.getContractAt("SmartAccountFactory", FACTORY_ADDRESS);

    // 1. Define the Action (e.g., Send 0.001 ETH to self)
    const sender = await factory.getAddress(signer.address, 123);
    const amount = ethers.utils.parseEther("0.001");
    
    // "initCode" tells EntryPoint to create the wallet if it doesn't exist
    const initCode = factory.interface.encodeFunctionData("createAccount", [signer.address, 123]);
    const factoryPayload = ethers.utils.hexConcat([FACTORY_ADDRESS, initCode]);

    // 2. Build UserOperation
    const userOp = {
        sender: sender,
        nonce: 0, // In real app, fetch from entryPoint.getNonce()
        initCode: factoryPayload, 
        callData: "0x", // Empty for just creation, or encode execute()
        callGasLimit: 100000,
        verificationGasLimit: 100000,
        preVerificationGas: 50000,
        maxFeePerGas: ethers.utils.parseUnits("10", "gwei"),
        maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
        paymasterAndData: "0x",
        signature: "0x"
    };

    // 3. Sign the UserOp
    const signedOp = await signUserOp(userOp, signer, ENTRY_POINT_ADDRESS, 5); // 5 = Goerli ChainID

    console.log("Sending UserOp to EntryPoint...");
    
    try {
        const tx = await entryPoint.handleOps([signedOp], signer.address);
        console.log(`UserOp Sent! Tx Hash: ${tx.hash}`);
    } catch (e) {
        console.error("Failed:", e.message);
    }
}

main();
