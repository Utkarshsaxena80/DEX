# Liquidity Pool Smart Contract

## Overview
This repository contains a Solidity smart contract implementing a simple liquidity pool that allows token swaps between two ERC20 tokens. The contract provides functionalities for adding and removing liquidity, as well as swapping tokens.

## Features
- **Add Liquidity:** Only the contract owner can add liquidity to the pool.
- **Remove Liquidity:** The owner can remove liquidity from the pool.
- **Swap Tokens:** Users can swap TokenA for TokenB and vice versa.
- **Get Reserves:** View function to fetch the current reserves of TokenA and TokenB.

## Smart Contract
### LiquidityPool.sol
This contract manages the liquidity pool, keeping track of reserves and handling swaps. It ensures:
- The swap respects the liquidity ratio.
- There are sufficient tokens in the pool before executing swaps.
- The owner is the only entity allowed to add or remove liquidity.

### Deployment Script
The `deployment.js` script deploys the contract using Hardhat. It:
- Fetches the network details and deployer account.
- Deploys two ERC20 tokens for testing.
- Deploys the LiquidityPool contract, passing token addresses as arguments.
- Deploys on different chains based on network configuration.

## Installation
To set up the project locally:
```sh
# Clone the repository
git clone https://github.com/Utkarshsaxena80/DEX.git
cd DEX

# Install dependencies
npm install
```

## Usage
### Running Tests
Use Hardhat to run the test suite:
```sh
npx hardhat test
```

### Deploying the Contract
To deploy on a local Hardhat network:
```sh
npx hardhat node
npx hardhat deploy --network localhost
```
For deploying on a live network, update the `hardhat.config.js` file with the appropriate network settings.

## License
This project is licensed under the MIT License.


