const { ethers } = require("hardhat");
const { FACTORY_ADDRESS } = require("./config");

async function main() {
    const factory = await ethers.getContractAt("SmartAccountFactory", FACTORY_ADDRESS);
    const [signer] = await ethers.getSigners();

    const SALT = 123;
    
    // Calculate where the wallet WILL be deployed
    const address = await factory.getAddress(signer.address, SALT);
    
    console.log(`Your Smart Account Address: ${address}`);
    console.log("Send some ETH here before deploying!");
}

main();
