const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should return correct IRR", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var guess = 10;
    var cashFlows = [-100,14,25,16,12,79,36,42]

    //Act
    var actual = await financialCalculations.irr(cashFlows, guess);

    //Assert
    var expected = 20;
    expect(actual).to.equal(expected);
  });
});
