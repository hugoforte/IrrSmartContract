const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should Multiply correctly", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var oneHundredDecimal = await financialCalculations.newFixed(100);

    //Act
    var actual = await financialCalculations.fromDecimal(oneHundredDecimal);

    //Assert
    var expected = 100;
    expect(actual).to.equal(expected);
  });

  it("Should be able to extract a decimal", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var integerPrecision = await financialCalculations.integerPrecision();
    var expected = 123;

    //Act
    var actual = await financialCalculations.fractional(integerPrecision + expected);

    //Assert
    expect(actual).to.equal(expected);
  });

  it("Should be able to store 12.345", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var decimalPlaces = 6
    var integerExpected = 12;
    var decimalExpected = 334455;
    var integerPrecision = await financialCalculations.integerPrecision();
    var fractionPrecision = 10 ** decimalPlaces;

    fractionPrecision
    var decimalNumber = await financialCalculations.newFixedFraction(12334455, fractionPrecision);
  
    //Act
    var integer = await financialCalculations.integer(decimalNumber);
    var decimal = await financialCalculations.fractional(decimalNumber);

    //Assert
    expect(integer/integerPrecision).to.equal(integerExpected);
    expect(decimal * fractionPrecision / integerPrecision).to.equal(decimalExpected);
  });

  it("Should be able to do 1.5 ^ 2 = 2.25", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var onePointFive = await financialCalculations.newFixedFraction(15, 10);
    var power = await financialCalculations.newFixed(2);
    var expectedSecondPower = await financialCalculations.newFixedFraction(225, 100);
    var expectedFifthPower = await financialCalculations.newFixedFraction(759375, 100000);

    //Act
    var secondPowerResult = await financialCalculations.power(onePointFive, 2);
    var fifthPowerResult = await financialCalculations.power(onePointFive, 5);

    //Assert
    expect(secondPowerResult).to.equal(expectedSecondPower);
    expect(fifthPowerResult).to.equal(expectedFifthPower);

  });
  
});
