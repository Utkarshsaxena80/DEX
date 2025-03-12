// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;
// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LiquidityPool {
 IERC20 public tokenA;
 IERC20 public tokenB;

 uint256 public reserveA;
 uint256 public reserveB;

   address public owner;
 event LiquidityAdded(address indexed user,uint256 amountA,uint256 amountB);
 event LiquidityRemoved(address indexed user,uint256 amountA,uint256 amountB);
 event TokenSwapped(address indexed user,uint256 amountIn, uint256 amountOut);
  
 constructor(address _tokenA, address _tokenB){
    tokenA=IERC20(_tokenA);
    tokenB=IERC20(_tokenB);
    owner=msg.sender;

 }
  modifier onlyOwner(){
   require(msg.sender==owner,"ONLY OWNER CAN ADD LIQUIDITY ");
   _;
  }
 function addLiquidity(uint256 amountA,uint256 amountB) external onlyOwner{
   require((tokenA.transferFrom(msg.sender,address(this),amountA)),"transfer failed");
    require((tokenB.transferFrom(msg.sender,address(this),amountB)),"transfer failed");
    reserveA += amountA;
    reserveB += amountB;
    emit LiquidityAdded(msg.sender,amountA,amountB);
 }
  function removeLiquidity(uint256 amountA, uint256 amountB) external onlyOwner { 
        require(reserveA >= amountA && reserveB >= amountB, "Insufficient reserves");
        require((tokenA.transfer(msg.sender, amountA)), "TokenA transfer failed");
        require((tokenB.transfer(msg.sender, amountB)), "TokenB transfer failed");
        reserveA -= amountA;
        reserveB -= amountB;
        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

   function swapTokenA(uint256 amountA) external {
    require(amountA > 0, "Amount must be greater than 0");
    require(reserveA > 0 && reserveB > 0, "Insufficient liquidity");
    uint256 amountB = (reserveB * amountA) / (reserveA + amountA);
    require(amountB > 0, "Amount too small to swap");
    require(amountB <= reserveB, "not enough TokenB");
    require(tokenA.transferFrom(msg.sender, address(this), amountA), "TokenA transfer failed");
    require(tokenB.transfer(msg.sender, amountB), "TokenB transfer failed");
    reserveA += amountA;
    reserveB -= amountB;
    emit TokenSwapped(msg.sender, amountA, amountB);
}
   function swapTokenB(uint256 amountB) external {
        uint256 amountA;
        amountA=((reserveA*reserveB)/(reserveB+amountB));
        require(reserveA >= amountA, "Insufficient tokenA in pool");
        require(tokenB.transferFrom(msg.sender, address(this), amountB), "TokenB transfer failed");
        require(tokenA.transfer(msg.sender, amountA), "TokenA transfer failed");
        reserveA -= amountA;
        reserveB += amountB;
        emit TokenSwapped(msg.sender, amountB, amountA);

   }
   function getReserves() external view returns(uint256,uint256){
    return (reserveA,reserveB);
   }
}