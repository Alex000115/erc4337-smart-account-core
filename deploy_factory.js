const { ethers } = require("hardhat");

async function main() {
    // Official EntryPoint Address (Goerli/Mumbai/Mainnet)
    const ENTRY_POINT = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"; 

    const Factory = await ethers.getContractFactory("SmartAccountFactory");
    const factory = await Factory.deploy(ENTRY_POINT);

    await factory.deployed();

    console.log(`Factory Deployed at: ${factory.address}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
