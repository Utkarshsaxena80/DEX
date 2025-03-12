
const {config:dotEnvConfig}=require("dotenv");
//const { artifacts } = require("hardhat");
dotEnvConfig();
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");

/** @type import('hardhat/config').HardhatUserConfig */
const SEPOLIA_RPC_url=process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_key=process.env.SEPOLIA_PRIVATE_KEY;
const HOLESKY_RPC_url=process.env.HOLESKY_RPC_URL;
const HOLESKY_API_KEY=process.env.HOLESKY_ETHERSCAN_API;
module.exports = {
  solidity: "0.8.28",
  defaultNetwork:"hardhat",
  networks:{
    hardhat :{
      chainId:31337,
      blockConfirmations:1,
      cors :true,
    },
    sepolia:{
      chainId:11155111,
      blockConfirmations:6,
      url:SEPOLIA_RPC_url,
      accounts:[SEPOLIA_PRIVATE_key],
    },
    holesky:{
      chainId:17000,
      blockConfirmations:6,
      url:HOLESKY_RPC_url,
      accounts:[SEPOLIA_PRIVATE_key],
    }
  },
  namedAccounts: {
    deployer: {
      default: 0, 
    },
  },
 etherscan:{
  apiKey:{
    holesky:HOLESKY_API_KEY,
  }
 },
 sourcify: {
  enabled: true
}

};