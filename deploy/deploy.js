const {network,getNamedAccounts,deployments}= require("hardhat");
//  const { TASK_NODE_SERVER_READY } = require("hardhat/builtin-tasks/task-names");
const { networkConfig, developmentChains } = require("../helper-hardhat-config.js");
module.exports=async ()=>{
    const {deploy,log}=deployments;
    const {deployer}=await getNamedAccounts();
    const chainId=network.config.chainId;
    log(`Network: ${network.name} (Chain ID: ${chainId})`);
    log(`Deployer: ${deployer}`);
     
    try{
        const uploadContract1=await deploy("one",{
            from :deployer,
            args:["utken","UTK",10000],
            log:true,
            waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
        });

        log(` Contract  "one" deployed to: ${uploadContract1.address}`);
        log("=================================================\n");
    }catch(error){
        console.error("Deployment Failed!");
    console.error(error);
    process.exit(1);
    }
    try{
        const uploadContract2=await deploy("two",{
            from :deployer,
            args:["Roster","RST",10000],
            log:true,
            waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
        });

        log(` Contract  " two" deployed to: ${uploadContract2.address}`);
        log("=================================================\n");
    }catch(error){
        console.error("Deployment Failed!");
    console.error(error);
    process.exit(1);
    }

  if(network.chainId==17000){
    console.log("in holesky")
    try{
        const uploadContract3=await deploy("LiquidityPool",{
            from :deployer,
            args:["0x4cE46A330C531B0054bD617EB97a624BD66dfd29","0xab57711419ea27Ac52Ef29D91507E4E99F0Ee2d6"],
            log:true,
            waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
        });

        log(` Contract  "main" deployed to: ${uploadContract3.address}`);
        log("=================================================\n");
    }catch(error){
        console.error("Deployment Failed!");
    console.error(error);
    process.exit(1);
    }
  }else{
    try{
        const uploadContract=await deploy("LiquidityPool",{
            from :deployer,
            args:["0x5FbDB2315678afecb367f032d93F642f64180aa3","0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"],
            log:true,
            waitConfirmations: networkConfig[chainId]?.blockConfirmations || 1,
        });

        log(` Contract  "main" deployed to: ${uploadContract.address}`);
        log("=================================================\n");
    }catch(error){
        console.error("Deployment Failed!");
    console.error(error);
    process.exit(1);
    }
  }    
}
module.exports.tags = ["deployment"];