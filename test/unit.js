const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityPool", function () {
    let owner, user1, user2;
    let TokenOne, tokenOne;
    let TokenTwo, tokenTwo;
    let LiquidityPool, liquidityPool;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        TokenOne = await ethers.getContractFactory("one");
        tokenOne = await TokenOne.connect(user1).deploy("TokenOne", "ONE", 10000);
        await tokenOne.waitForDeployment();

        TokenTwo = await ethers.getContractFactory("two");
        tokenTwo = await TokenTwo.connect(user1).deploy("TokenTwo", "TWO", 10000);
        await tokenTwo.waitForDeployment();

        LiquidityPool = await ethers.getContractFactory("LiquidityPool");
        liquidityPool = await LiquidityPool.connect(user1).deploy(tokenOne.target, tokenTwo.target);
        await liquidityPool.waitForDeployment();
    });

    it("should deploy with correct token addresses", async function () {
        expect(await liquidityPool.tokenA()).to.equal(tokenOne.target);
        expect(await liquidityPool.tokenB()).to.equal(tokenTwo.target);
    });

    it("should allow ONLY the owner to add liquidity", async function () {
        const amountA = 500;
        const amountB = 500;
        await tokenOne.connect(user1).approve(liquidityPool.target, amountA);
        await tokenTwo.connect(user1).approve(liquidityPool.target, amountB);

        await expect(liquidityPool.connect(user1).addLiquidity(amountA, amountB))
            .to.emit(liquidityPool, "LiquidityAdded")
            .withArgs(user1.address, amountA, amountB);
            console.log("liquidity added");

        const [reserveA, reserveB] = await liquidityPool.getReserves();
        expect(reserveA).to.equal(amountA);
        expect(reserveB).to.equal(amountB);
        console.log("reserve equal");

        await tokenOne.connect(user2).approve(liquidityPool.target, amountA);
        await tokenTwo.connect(user2).approve(liquidityPool.target, amountB);

        await expect(liquidityPool.connect(user2).addLiquidity(amountA, amountB))
            .to.be.revertedWith("ONLY OWNER CAN ADD LIQUIDITY ");
    });

    it("should allow ONLY the owner to remove liquidity", async function () {
        const amountA = 500;
        const amountB = 500;

        await tokenOne.connect(user1).approve(liquidityPool.target, amountA);
        await tokenTwo.connect(user1).approve(liquidityPool.target, amountB);
        await liquidityPool.connect(user1).addLiquidity(amountA, amountB);
        await expect(liquidityPool.connect(user1).removeLiquidity(200, 200))
            .to.emit(liquidityPool, "LiquidityRemoved")
            .withArgs(user1.address, 200, 200);

        const [reserveA, reserveB] = await liquidityPool.getReserves();
        expect(reserveA).to.equal(300);
        expect(reserveB).to.equal(300);

        await expect(liquidityPool.connect(user2).removeLiquidity(100, 100))
            .to.be.revertedWith("ONLY OWNER CAN ADD LIQUIDITY ");
    });

    it("should swap TokenA for TokenB correctly", async function () {
        const amountA = 1000;
        const amountB = 1000;

        await tokenOne.connect(user1).approve(liquidityPool.target, amountA);
        await tokenTwo.connect(user1).approve(liquidityPool.target, amountB);
        await liquidityPool.connect(user1).addLiquidity(amountA, amountB);
        await tokenOne.connect(user1).transfer(user2.address, 200); 
        await tokenOne.connect(user2).approve(liquidityPool.target, 100);
        await expect(liquidityPool.connect(user2).swapTokenA(100))
            .to.emit(liquidityPool, "TokenSwapped");
        const [newReserveA, newReserveB] = await liquidityPool.getReserves();
        expect(newReserveA).to.be.greaterThan(amountA);
        expect(newReserveB).to.be.lessThan(amountB);
        console.log(newReserveB);
        console.log(newReserveA);
    });

    it("should swap TokenB for TokenA correctly", async function () {
        const amountA = 1000;
        const amountB = 1000;

        await tokenOne.connect(user1).approve(liquidityPool.target, amountA);
        await tokenTwo.connect(user1).approve(liquidityPool.target, amountB);
        await liquidityPool.connect(user1).addLiquidity(amountA, amountB);
        await tokenTwo.connect(user1).transfer(user2.address, 200);
        await tokenTwo.connect(user2).approve(liquidityPool.target, 100);
        await expect(liquidityPool.connect(user2).swapTokenB(100))
            .to.emit(liquidityPool, "TokenSwapped");
        const [newReserveA, newReserveB] = await liquidityPool.getReserves();
        expect(newReserveA).to.be.lessThan(amountA);
        expect(newReserveB).to.be.greaterThan(amountB);
        console.log(newReserveB);
        console.log(newReserveA);
    });
    it("should fail if trying to swap more than reserves", async function () {
        const amountA = 100;
        const amountB = 100;
    
        // User1 approves liquidity pool to transfer tokens
        await tokenOne.connect(user1).approve(liquidityPool.target, amountA);
        await tokenTwo.connect(user1).approve(liquidityPool.target, amountB);
    
        // User1 adds liquidity
        await liquidityPool.connect(user1).addLiquidity(amountA, amountB);
    
        // Transfer tokens to User2 so they can attempt swaps
        await tokenTwo.connect(user1).transfer(user2.address, 100);
        await tokenOne.connect(user1).transfer(user2.address, 100);
    
        // User2 approves liquidity pool to use their tokens
        await tokenOne.connect(user2).approve(liquidityPool.target, 50);
        // Attempt to swap more TokenA than reserves allow
        // await expect(liquidityPool.connect(user2).swapTokenA(50))
        // .to.be.revertedWith("not enough TokenB");
        // console.log( await liquidityPool.reserveA());
    
        // Attempt to swap more TokenB than reserves allow
        await expect(liquidityPool.connect(user2).swapTokenB(50))
            .to.be.revertedWith("Insufficient tokenA in pool");
    });
    
});
