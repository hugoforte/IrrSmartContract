pragma solidity ^0.8.0;


contract FinancialCalculations {
    //Number of decimals supported
    int public constant precision = 10;
    // mapping(uint => int) private decimalCashFlows;
    
    //Guess only supports single decimals, 0.2 => 2, 0.09 will not work
    function irr(int[] memory cashFlows, int guess) public pure returns(int){
        //Convert cashflows to decimal types
        for(uint i = 0; i < cashFlows.length ; i++){
            cashFlows[i] = newFixed(cashFlows[i]);
        }

        //Guess only supports single decimals, 0.2 => 2, 0.09 will not work, I'm assuming 10 as the fraction
        guess = newFixedFraction(guess, 10);
        int retVal = 19883;
        return retVal;
    }

    // function sumOfIRRPolynomial(int[] memory cashFlows, int estimatedReturnRate) public pure returns(int){
    //     int sumOfPolynomial = 0;
    //     // if (IsValidIterationBounds(estimatedReturnRate))
    //         for (var i = 0; j < cashFlows.length; i++)
    //         {
    //             sumOfPolynomial = sumOfPolynomial + (cashFlows[i] / (Math.Pow((1 + estimatedReturnRate), j)));
    //         }
    //     return sumOfPolynomial;
    // }

    /**************************************************************************************
    ***************************************************************************************
    ***************************************************************************************
     * ported from: https://medium.com/cementdao/fixed-point-math-in-solidity-616f4508c6e8
     * Hardcoded to 24 digits.
    ***************************************************************************************
    ***************************************************************************************
     */
    function newFixed(int x) public pure returns (int)
    {
        return x * integerPrecision();
    }
    function fromDecimal(int x) public pure returns (int)
    {
        return x / integerPrecision(); // Can't overflow
    }
    function integerPrecision() public pure returns(int) {
        return 1000000000000000000000000;
    }
    function mulPrecision() public pure returns(int) {
        return 1000000000000;
    }
    function maxFixedDivisor() public pure returns(int) {
        return 1000000000000000000000000000000000000000000000000;
    }
    function maxNewFixed() public pure returns(int256) {
        return 57896044618658097711785492504343953926634992332820282;
    }
    function integer(int x) public pure returns (int) {
        return (x / integerPrecision()) * integerPrecision(); // Can't overflow
    }
    function fractional(int x) public pure returns (int) {
        return x - (x / integerPrecision()) * integerPrecision(); // Can't overflow
    }
    function reciprocal(int256 x) public pure returns (int256) {
        assert(x != 0);
        return (integerPrecision()*integerPrecision()) / x; // Can't overflow
    }
    function add(int x, int y) public pure returns (int) {
        int z = x + y;
        if (x > 0 && y > 0) assert(z > x && z > y);
        if (x < 0 && y < 0) assert(z < x && z < y);
        return z;
    }
    function subtract(int x, int y) public pure returns (int) {
        return add(x,-y);
    }
    function newFixedFraction(int256 numerator, int256 denominator)public pure returns (int256){
        assert(numerator <= maxNewFixed());
        assert(denominator <= maxNewFixed());
        assert(denominator != 0);
        int256 convertedNumerator = newFixed(numerator);
        int256 convertedDenominator = newFixed(denominator);
        return divide(convertedNumerator, convertedDenominator);
    }
    function multiply(int x, int y) public pure returns (int) {
        if (x == 0 || y == 0) return 0;
        if (y == integerPrecision()) return x;
        if (x == integerPrecision()) return y;

        // Separate into integer and fractional parts
        // x = x1 + x2, y = y1 + y2
        int x1 = integer(x) / integerPrecision();
        int x2 = fractional(x);
        int y1 = integer(y) / integerPrecision();
        int y2 = fractional(y);
        
        // (x1 + x2) * (y1 + y2) = (x1 * y1) + (x1 * y2) + (x2 * y1) + (x2 * y2)
        int x1y1 = x1 * y1;
        if (x1 != 0) assert(x1y1 / x1 == y1); // Overflow x1y1
        
        // x1y1 needs to be multiplied back by integerPrecision
        // solium-disable-next-line mixedcase
        int fixed_x1y1 = x1y1 * integerPrecision();
        if (x1y1 != 0) assert(fixed_x1y1 / x1y1 == integerPrecision()); // Overflow x1y1 * integerPrecision
        x1y1 = fixed_x1y1;

        int x2y1 = x2 * y1;
        if (x2 != 0) assert(x2y1 / x2 == y1); // Overflow x2y1

        int x1y2 = x1 * y2;
        if (x1 != 0) assert(x1y2 / x1 == y2); // Overflow x1y2

        x2 = x2 / mulPrecision();
        y2 = y2 / mulPrecision();
        int x2y2 = x2 * y2;
        if (x2 != 0) assert(x2y2 / x2 == y2); // Overflow x2y2

        // result = integerPrecision() * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / integerPrecision();
        int result = x1y1;
        result = add(result, x2y1); // Add checks for overflow
        result = add(result, x1y2); // Add checks for overflow
        result = add(result, x2y2); // Add checks for overflow
        return result;
    }
    //only supports whole numbers for y
    function power(int x, int y) public pure returns (int) {
        int retVal = x;
        for(int i = 1; i < y; i++){
            retVal = multiply(retVal, x);
        }
        return retVal;
    }
    function divide(int x, int y) public pure returns (int) {
        if (y == integerPrecision()) return x;
        assert(y != 0);
        assert(y <= maxFixedDivisor());
        return multiply(x, reciprocal(y));
    }
}
