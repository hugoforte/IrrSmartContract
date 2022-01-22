const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should return guess", async function () {
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var guess = 10;
    var cashFlows = [-100,14,25,16,12,79,36,42]
    expect(await financialCalculations.irr(cashFlows, guess)).to.equal(guess);
  });
});
