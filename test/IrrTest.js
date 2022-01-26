// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("FinancialCalculations", function () {
//   it("Should return correct IRR", async function () {
//     //Arrange
//     const FinancialCalculations = await ethers.getContractFactory("FinancialCalculations");
//     const financialCalculations = await FinancialCalculations.deploy();
//     await financialCalculations.deployed();
//     var guess = 1;
//     var cashFlows = [-100, 14, 25, 16, 12, 79, 36, 42]

//     //Act
//     var actual = await financialCalculations.irr(cashFlows, guess);
//     var integerPart = await financialCalculations.integer(actual);
//     var decimalPart = await financialCalculations.fractional(actual);

//     //Assert
//     AssertIntegersAreEqual(integerPart, 0);
//     AssertDecimalsAreEqual(decimalPart, 1988344138, 10);
//   });

//   function AssertIntegersAreEqual(actual, expected) {
//     var intPrecision = 1000000000000000000000000;
//     expect(Math.trunc(actual / intPrecision)).to.equal(expected);
//   }

//   function AssertDecimalsAreEqual(actual, expected, precision) {
//     var decimalMaxPrecision = 100000000000000000000000;
//     var maxPrecisionForDecimal = 23;
//     var divisorToGetPrecision = decimalMaxPrecision / (10 ** (precision - 1))
//     var actualTruncatedAndAbsoluted = Math.abs(Math.trunc(actual / divisorToGetPrecision))
//     expect(actualTruncatedAndAbsoluted).to.equal(expected);
//   }
// });
