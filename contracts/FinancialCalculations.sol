pragma solidity ^0.8.0;

contract FinancialCalculations {
    //Number of decimals supported
    uint256 public constant precision = 10;

    function irr(int256[] memory cashFlows, int256 guess)
        public
        pure
        returns (int256)
    {
        require(
            (0 <= guess && guess <= 10),
            "Guess has to be a decimal representation between 1 (representing 10%) and 9(representing 90%"
        );

        //Convert cashflows to fractions
        for (uint256 i = 0; i < cashFlows.length; i++) {
            cashFlows[i] = newFixed(cashFlows[i]);
        }
        int256 convergingIrr = newFixedFraction(guess, 10);

        return irrUsingFractions(cashFlows, convergingIrr);
    }

    function irrUsingFractions(int256[] memory cashFlows, int256 convergingIrr)
        public
        pure
        returns (int256)
    {
        //Guess only supports single decimals, 0.2 => 2, 0.09 will not work
        int256 currentIrrPolynomial = 0;
        int256 currentDerivative = 0;
        int256 quotient;
        bool doMore = true;

        currentIrrPolynomial = calcSumIrrPolynomial(cashFlows, convergingIrr);
        //while (hasPolynomialConverged(currentIrrPolynomial)) {
        while (doMore) {
            currentDerivative = calcSumIrrDerivative(cashFlows, convergingIrr);
            quotient = divide(currentIrrPolynomial, currentDerivative);
            convergingIrr = subtract(convergingIrr, quotient);
            currentIrrPolynomial = calcSumIrrPolynomial(
                cashFlows,
                convergingIrr
            );
            doMore = false;
        }
        return convergingIrr;
    }

    function hasPolynomialConverged(int256 irrPolynomial)
        public
        pure
        returns (bool)
    {
        //TODO - fix hard coding
        int256 convergencePoint = newFixedFraction(1, 10**6);
        return irrPolynomial <= convergencePoint;
    }

    function convertArray(int256[] memory cashFlows) public pure {
        for (uint256 i = 0; i < cashFlows.length; i++) {
            cashFlows[i] = newFixed(cashFlows[i]);
        }
    }

    function calcIrrPolynomial(
        int256 cashFlow,
        int256 estimatedReturnRate,
        uint16 period
    ) public pure returns (int256) {
        int256 retVal = 0;
        int256 one = newFixed(1);
        int256 numerator = cashFlow;
        int256 addedOneToEstimatedReturnRate = add(one, estimatedReturnRate);
        int256 denominator = power(addedOneToEstimatedReturnRate, period);
        retVal = divide(numerator, denominator);
        return retVal;
    }

    function calcSumIrrPolynomial(
        int256[] memory cashFlows,
        int256 estimatedReturnRate
    ) public pure returns (int256) {
        int256 sumOfPolynomial = 0;
        // if (IsValidIterationBounds(estimatedReturnRate))
        for (uint16 i = 0; i < cashFlows.length; i++) {
            int256 irrPolynomial = calcIrrPolynomial(
                cashFlows[i],
                estimatedReturnRate,
                i
            );
            sumOfPolynomial = add(sumOfPolynomial, irrPolynomial);
        }
        return sumOfPolynomial;
    }

    function calcIrrDerivative(
        int256 cashFlow,
        int256 estimatedReturnRate,
        uint16 period
    ) public pure returns (int256) {
        int256 retVal = 0;
        int256 one = newFixed(1);
        //Will throw for values our of range
        int256 periodFraction = newFixed(int16(period));
        int256 numerator = multiply(cashFlow, periodFraction);
        int256 addedOneToEstimatedReturnRate = add(one, estimatedReturnRate);
        int256 denominator = power(addedOneToEstimatedReturnRate, period);
        retVal = divide(numerator, denominator);
        return retVal;
    }

    function calcSumIrrDerivative(
        int256[] memory cashFlows,
        int256 estimatedReturnRate
    ) public pure returns (int256) {
        int256 sumOfDerivative = 0;
        // if (IsValidIterationBounds(estimatedReturnRate))
        for (uint16 i = 1; i < cashFlows.length; i++) {
            int256 irrDerivative = calcIrrDerivative(
                cashFlows[i],
                estimatedReturnRate,
                i
            );
            sumOfDerivative = add(sumOfDerivative, irrDerivative);
        }
        return multiply(sumOfDerivative, newFixed(-1));
    }

    /***************************************************************************************
     ***************************************************************************************
     ***************************************************************************************
     * ported from: https://medium.com/cementdao/fixed-point-math-in-solidity-616f4508c6e8
     * Hardcoded to 24 digits.
     ***************************************************************************************
     ***************************************************************************************
     */
    function newFixed(int256 x) public pure returns (int256) {
        return x * integerPrecision();
    }

    function fromDecimal(int256 x) public pure returns (int256) {
        return x / integerPrecision(); // Can't overflow
    }

    function integerPrecision() public pure returns (int256) {
        return 1000000000000000000000000;
    }

    function mulPrecision() public pure returns (int256) {
        return 1000000000000;
    }

    function maxFixedDivisor() public pure returns (int256) {
        return 1000000000000000000000000000000000000000000000000;
    }

    function maxNewFixed() public pure returns (int256) {
        return 57896044618658097711785492504343953926634992332820282;
    }

    function integer(int256 x) public pure returns (int256) {
        return (x / integerPrecision()) * integerPrecision(); // Can't overflow
    }

    function fractional(int256 x) public pure returns (int256) {
        return x - (x / integerPrecision()) * integerPrecision(); // Can't overflow
    }

    function reciprocal(int256 x) public pure returns (int256) {
        assert(x != 0);
        return (integerPrecision() * integerPrecision()) / x; // Can't overflow
    }

    function add(int256 x, int256 y) public pure returns (int256) {
        int256 z = x + y;
        if (x > 0 && y > 0) assert(z > x && z > y);
        if (x < 0 && y < 0) assert(z < x && z < y);
        return z;
    }

    function subtract(int256 x, int256 y) public pure returns (int256) {
        return add(x, -y);
    }

    function newFixedFraction(int256 numerator, int256 denominator)
        public
        pure
        returns (int256)
    {
        assert(numerator <= maxNewFixed());
        assert(denominator <= maxNewFixed());
        assert(denominator != 0);
        int256 convertedNumerator = newFixed(numerator);
        int256 convertedDenominator = newFixed(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }

    function multiply(int256 x, int256 y) public pure returns (int256) {
        if (x == 0 || y == 0) return 0;
        if (y == integerPrecision()) return x;
        if (x == integerPrecision()) return y;

        // Separate into integer and fractional parts
        // x = x1 + x2, y = y1 + y2
        int256 x1 = integer(x) / integerPrecision();
        int256 x2 = fractional(x);
        int256 y1 = integer(y) / integerPrecision();
        int256 y2 = fractional(y);

        // (x1 + x2) * (y1 + y2) = (x1 * y1) + (x1 * y2) + (x2 * y1) + (x2 * y2)
        int256 x1y1 = x1 * y1;
        if (x1 != 0) assert(x1y1 / x1 == y1); // Overflow x1y1

        // x1y1 needs to be multiplied back by integerPrecision
        int256 fixed_x1y1 = x1y1 * integerPrecision();
        if (x1y1 != 0) assert(fixed_x1y1 / x1y1 == integerPrecision()); // Overflow x1y1 * integerPrecision
        x1y1 = fixed_x1y1;

        int256 x2y1 = x2 * y1;
        if (x2 != 0) assert(x2y1 / x2 == y1); // Overflow x2y1

        int256 x1y2 = x1 * y2;
        if (x1 != 0) assert(x1y2 / x1 == y2); // Overflow x1y2

        x2 = x2 / mulPrecision();
        y2 = y2 / mulPrecision();
        int256 x2y2 = x2 * y2;
        if (x2 != 0) assert(x2y2 / x2 == y2); // Overflow x2y2

        // result = integerPrecision() * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / integerPrecision();
        int256 result = x1y1;
        result = add(result, x2y1); // Add checks for overflow
        result = add(result, x1y2); // Add checks for overflow
        result = add(result, x2y2); // Add checks for overflow
        return result;
    }

    //only supports whole numbers for y
    function power(int256 x, uint256 y) public pure returns (int256) {
        if (y == 0) return newFixed(1);
        int256 retVal = x;
        for (uint256 i = 1; i < y; i++) {
            retVal = multiply(retVal, x);
        }
        return retVal;
    }

    function divide(int256 x, int256 y) public pure returns (int256) {
        if (y == integerPrecision()) return x;
        assert(y != 0);
        assert(y <= maxFixedDivisor());
        return multiply(x, reciprocal(y));
    }

    function abs(int256 x) private pure returns (int256) {
        return x >= 0 ? x : -x;
    }
}
