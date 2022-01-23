const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should return correct IRR", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var guess = 2;
    var cashFlows = [-100,14,25,16,12,79,36,42]

    //Act
    var actual = await financialCalculations.irr(cashFlows, guess);

    //Assert
    var expected = 19883;
    expect(actual).to.equal(expected);
  });

  it("Should calculate IRRPolynomial", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var integerPrecision = await financialCalculations.integerPrecision();
    var cashFlow = await financialCalculations.newFixed(-100);
    var estimate = await financialCalculations.newFixedFraction(1, 10);

    //Act
    var irrPolynomial = await financialCalculations.calcIrrPolynomial(cashFlow, estimate, 0);
    var actual = await financialCalculations.integer(irrPolynomial);

    //Assert
    AssertIntegersAreEqual(irrPolynomial, -100);
  });

  // it("Should calculate sumOfIRRPolynomial", async function () {
  //   //Arrange
  //   const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
  //   const financialCalculations = await FinancialCalculations.deploy();
  //   await financialCalculations.deployed();
  //   var guess = 1;
  //   var cashFlows = [-100,14,25,16,12,79,36,42]

  //   //Act
  //   var actual = await financialCalculations.calcSumIrrPolynomial(cashFlows, guess);

  //   //Assert
  //   //44532115000171080
  //   var expected = 2342;
  //   expect(actual).to.equal(expected);
  // });

  it("Should convert array to fractions", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var guess = 1;
    var cashFlows = [-100,14,25,16,12,79,36,42]

    //Act
    await financialCalculations.convertArray(cashFlows);

    //Assert
    var expected = -100;
    expect(cashFlows[0]).to.equal(expected);
  });

  function AssertIntegersAreEqual(actual, expected) {
    var intPrecision = 1000000000000000000000000;
    expect(actual/intPrecision).to.equal(expected);
  }

  function AssertDecimalsAreEqual(actual, expected, precision) {
    var intPrecision = 1000000000000000000000000;
    expect(actual * precision / intPrecision).to.equal(expected);
  }
});
