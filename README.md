# ERC-4337 Smart Account Core 🛡️

![Solidity](https://img.shields.io/badge/Solidity-0.8.19-black) ![Standard](https://img.shields.io/badge/EIP-4337-blue) ![Wallet](https://img.shields.io/badge/Type-Smart%20Contract%20Wallet-purple)

## Overview

This repository implements the **Account Abstraction** standard. Unlike traditional Externally Owned Accounts (EOAs) like MetaMask, these are "Smart Accounts" controlled by code.

### Key Components

1.  **SmartAccount.sol**: The user's wallet. It can execute batch transactions and is controlled by an owner key.
2.  **Factory.sol**: A deterministic deployment contract that creates wallets using `CREATE2` (counterfactual deployment).
3.  **UserOperation**: Instead of transactions, users sign "UserOps". These are bundled and sent to the EntryPoint.

### Why is this "Expert" level?
It interacts directly with the official **EntryPoint** contract to validate signatures (`validateUserOp`) and execute calls. This is the foundation of "Gasless Transactions" and "Social Login".

## Setup & Usage

1.  **Deploy Factory**:
    ```bash
    npx hardhat run deploy_factory.js
    ```
2.  **Generate Address**:
    Calculate the counterfactual address of a wallet *before* deploying it.
    ```bash
    node get_address.js
    ```
3.  **Send UserOp**:
    Sign and submit an operation to the EntryPoint.
    ```bash
    node send_userop.js
    ```

---
*The Future of Ethereum Wallets.*
