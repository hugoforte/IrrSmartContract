const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("FinancialCalculations", function () {
  it("Should return correct IRR", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var guess = 1;
    var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]

    //Act
    var actual = await financialCalculations.irr(cashFlows, guess);
    var integerPart = await financialCalculations.integer(actual);
    var decimalPart = await financialCalculations.fractional(actual);

    //Assert
    AssertIntegersAreEqual(integerPart, 0);
    AssertDecimalsAreEqual(decimalPart, 1694776342, 10);
  });

  it("Should return correct IRRWhenUsingFractions", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]
    var guess = await financialCalculations.newFixedFraction(1, 10);
    var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]
    for (var i = 0; i < cashFlows.length; i++) {
      cashFlows[i] = await financialCalculations.newFixed(cashFlows[i]);
    }

    //Act
    var actual = await financialCalculations.irrUsingFractions(cashFlows, guess);
    var integerPart = await financialCalculations.integer(actual);
    var decimalPart = await financialCalculations.fractional(actual);

    //Assert
    var expected = 19883;
    AssertIntegersAreEqual(integerPart, 0);
    AssertDecimalsAreEqual(decimalPart, 1694776342, 10);
  });

  it("Should be able to determine when the polynomial has converged", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var largerThanConvergence = await financialCalculations.newFixedFraction(1, 10 ** 5);
    var onConvergence = await financialCalculations.newFixedFraction(1, 10 ** 6);
    var smallerThanConvergence = await financialCalculations.newFixedFraction(1, 10 ** 7);

    //Act
    var largerShouldBeFalse = await financialCalculations.hasPolynomialConverged(largerThanConvergence);
    var equalShouldBeTrue = await financialCalculations.hasPolynomialConverged(onConvergence);
    var largerShouldBeTrue = await financialCalculations.hasPolynomialConverged(smallerThanConvergence);

    //Assert
    expect(largerShouldBeFalse).to.equal(false);
    expect(equalShouldBeTrue).to.equal(true);
    expect(largerShouldBeTrue).to.equal(true);
  });

  it("Should calculate IRRPolynomial for initial cash position", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var cashFlow = await financialCalculations.newFixed(-100);
    var estimate = await financialCalculations.newFixedFraction(1, 10);

    //Act
    var irrPolynomial = await financialCalculations.calcIrrPolynomial(cashFlow, estimate, 0);
    var actual = await financialCalculations.integer(irrPolynomial);

    //Assert
    AssertIntegersAreEqual(actual, -100);
  });

  it("Should calculate IRRPolynomial for initial cash position", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var cashFlow = await financialCalculations.newFixed(-100);
    var estimate = await financialCalculations.newFixedFraction(1, 10);

    //Act
    var irrPolynomial = await financialCalculations.calcIrrPolynomial(cashFlow, estimate, 0);
    var actual = await financialCalculations.integer(irrPolynomial);

    //Assert
    AssertIntegersAreEqual(actual, -100);
  });

  it("Should calculate IRRPolynomial for first period", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var cashFlow = await financialCalculations.newFixed(14);
    var estimate = await financialCalculations.newFixedFraction(1, 10);

    //Act
    var irrPolynomial = await financialCalculations.calcIrrPolynomial(cashFlow, estimate, 1);
    var integerPart = await financialCalculations.integer(irrPolynomial);
    var decimalPart = await financialCalculations.fractional(irrPolynomial);

    //Assert
    AssertIntegersAreEqual(integerPart, 12);
    AssertDecimalsAreEqual(decimalPart, 727272, 6);
  });

  it("Should calculate sum of IRRPolynomial for a set of cashflows", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var estimate = await financialCalculations.newFixedFraction(1, 10);
    var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]
    for (var i = 0; i < cashFlows.length; i++) {
      cashFlows[i] = await financialCalculations.newFixed(cashFlows[i]);
    }

    //Act
    var actual = await financialCalculations.calcSumIrrPolynomial(cashFlows, estimate);
    var integerPart = await financialCalculations.integer(actual);
    var decimalPart = await financialCalculations.fractional(actual);

    //Assert
    AssertIntegersAreEqual(integerPart, 44);
    AssertDecimalsAreEqual(decimalPart, 5321150001, 10);
  });

  it("Should calculate IRRDerivative for first period", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var cashFlow = await financialCalculations.newFixed(14);
    var estimate = await financialCalculations.newFixedFraction(1, 10);

    //Act
    var irrDerivative = await financialCalculations.calcIrrDerivative(cashFlow, estimate, 1);
    var integerPart = await financialCalculations.integer(irrDerivative);
    var decimalPart = await financialCalculations.fractional(irrDerivative);

    //Assert
    AssertIntegersAreEqual(integerPart, 12);
    AssertDecimalsAreEqual(decimalPart, 727272, 6);
  });

  it("Should calculate sum of IRRDerivative for a set of cashflows", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();

    var estimate = await financialCalculations.newFixedFraction(1, 10);
    var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]
    for (var i = 0; i < cashFlows.length; i++) {
      cashFlows[i] = await financialCalculations.newFixed(cashFlows[i]);
    }

    //Act
    var irrDerivative = await financialCalculations.calcSumIrrDerivative(cashFlows, estimate);
    var integerPart = await financialCalculations.integer(irrDerivative);
    var decimalPart = await financialCalculations.fractional(irrDerivative);

    //Assert
    AssertIntegersAreEqual(integerPart, -640);
    AssertDecimalsAreEqual(decimalPart, 9561213374, 10);
  });


  //TODO fix this one - it should be comparing against newFixed
  it("Should convert array to fractions", async function () {
    //Arrange
    const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
    const financialCalculations = await FinancialCalculations.deploy();
    await financialCalculations.deployed();
    var guess = 1;
    var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]

    //Act
    await financialCalculations.convertArray(cashFlows);

    //Assert
    var expected = -100;
    expect(cashFlows[0]).to.equal(expected);
  });

  function AssertIntegersAreEqual(actual, expected) {
    var intPrecision = 1000000000000000000000000;
    expect(Math.trunc(actual / intPrecision)).to.equal(expected);
  }

  function AssertDecimalsAreEqual(actual, expected, precision) {
    var decimalMaxPrecision = 100000000000000000000000;
    var maxPrecisionForDecimal = 23;
    var divisorToGetPrecision = decimalMaxPrecision / (10 ** (precision - 1))
    var actualTruncatedAndAbsoluted = Math.abs(Math.trunc(actual / divisorToGetPrecision))
    expect(actualTruncatedAndAbsoluted).to.equal(expected);
  }
});
