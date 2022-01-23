const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should Multiply correctly", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var oneHundredDecimal = await financialCalculations.newDecimal(100);

    //Act
    var actual = await financialCalculations.fromDecimal(oneHundredDecimal);

    //Assert
    var expected = 100;
    expect(actual).to.equal(expected);
  });
});
