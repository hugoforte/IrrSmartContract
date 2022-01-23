const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MathTests", function () {
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

  it("Should be able to get an integer back", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var integerPrecision = await financialCalculations.integerPrecision();
    var expected = 123;

    //Act
    var actual = await financialCalculations.newFixed(expected);

    //Assert
    expect(actual/integerPrecision).to.equal(expected);
  });

  it("Should be able to get a fraction back", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var integerPrecision = await financialCalculations.integerPrecision();
    var decimalExpected = 123;
    var fractionPrecision = 1000;

    //Act
    var decimalNumber = await financialCalculations.newFixedFraction(decimalExpected, fractionPrecision);
    var integer = await financialCalculations.integer(decimalNumber);
    var decimal = await financialCalculations.fractional(decimalNumber);

    //Assert
    expect(integer/integerPrecision).to.equal(0);
    expect(decimal * fractionPrecision / integerPrecision).to.equal(decimalExpected);
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

    //Act
    var fraction = await financialCalculations.newFixedFraction(12334455, fractionPrecision);
    var integer = await financialCalculations.integer(fraction);
    var decimal = await financialCalculations.fractional(fraction);

    //Assert
    expect(integer/integerPrecision).to.equal(integerExpected);
    expect(decimal * fractionPrecision / integerPrecision).to.equal(decimalExpected);
  });

  it("Should be able to do powers math", async function () {
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

  it("Should be to store a negative as a fraction", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();


    //Act
    var negativeOneHundred = await financialCalculations.newFixed(-100);

    //Assert
    AssertIntegersAreEqual(negativeOneHundred, -100);
  });

  it("Should be able to add 1 to 0.1", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var zeroPointOne = await financialCalculations.newFixedFraction(1, 10);
    var one = await financialCalculations.newFixed(1);

    //Act
    var onePointOne = await financialCalculations.add(one, zeroPointOne);
    var integer = await financialCalculations.integer(onePointOne);
    var decimal = await financialCalculations.fractional(onePointOne);

    //Assert
    AssertIntegersAreEqual(integer, 1);
    AssertDecimalsAreEqual(decimal, 10, 2);
  });

  it("Should be able to do 1.1 ^ 1", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var onePointOne = await financialCalculations.newFixedFraction(11, 10);

    //Act
    var onePointOneToThePowerOfOne = await financialCalculations.power(onePointOne, 1);

    //Assert
    expect(onePointOneToThePowerOfOne).to.equal(onePointOne);
  });

  it("Should be able to do 1.1 ^ 0", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var onePointOne = await financialCalculations.newFixedFraction(11, 10);

    //Act
    var one = await financialCalculations.power(onePointOne, 0);

    //Assert
    AssertIntegersAreEqual(one, 1);
  });

  it("Should be able to do -100 / 1", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var negOneHundred = await financialCalculations.newFixed(-100);
    var one = await financialCalculations.newFixed(1);

    //Act
    var actual = await financialCalculations.divide(negOneHundred, one);

    //Assert
    AssertIntegersAreEqual(actual, -100);
  });

  function AssertIntegersAreEqual(actual, expected) {
    var intPrecision = 1000000000000000000000000;
    expect(actual/intPrecision).to.equal(expected);
  }

  function AssertDecimalsAreEqual(actual, expected, precision) {
    var decimalMaxPrecision = 100000000000000000000000;
    var maxPrecisionForDecimal = 23;
    var divisorToGetPrecision =  decimalMaxPrecision/(10 ** (precision-1))
    expect(actual / (decimalMaxPrecision/10)).to.equal(expected);
    expect(divisorToGetPrecision).to.equal(decimalMaxPrecision/10);

    expect(actual / divisorToGetPrecision).to.equal(expected);
  }
});