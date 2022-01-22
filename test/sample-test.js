const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should return guess", async function () {
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    expect(await financialCalculations.irr(10)).to.equal(10);
  });
});
