pragma solidity ^0.8.0;


contract FinancialCalculations {
    //Number of decimals supported
    int public constant precision = 10;
    mapping(uint => uint) private decimalCashFlows;
    
    function irr(int[] memory cashFlows, int guess) public pure returns(int){
        int retVal = guess * precision;
        //mapping (int => int) calldata decimalCashFlows;
        //decimal[cashFlows.]
        copyCashFlowsToMappingAsDecimals(cashFlows);
        return retVal;
    }

    function copyCashFlowsToMappingAsDecimals (int[] memory cashFlows) private pure{
    
    }




    /**************************************************************************************
    /**************************************************************************************
    /**************************************************************************************    
     * ported from: https://medium.com/cementdao/fixed-point-math-in-solidity-616f4508c6e8
     * Hardcoded to 24 digits.
     */
    function newDecimal(int x) public pure returns (int)
    {
        return x * fixed1();
    }
    function fromDecimal(int x) public pure returns (int)
    {
        return x / fixed1(); // Can't overflow
    }
    function fixed1() public pure returns(int) {
        return 1000000000000000000000000;
    }
    function mulPrecision() public pure returns(int) {
        return 1000000000000;
    }
    function maxFixedDivisor() public pure returns(int) {
        return 1000000000000000000000000000000000000000000000000;
    }
    function integer(int x) public pure returns (int) {
        return (x / fixed1()) * fixed1(); // Can't overflow
    }
    function fractional(int x) public pure returns (int) {
        return x - (x / fixed1()) * fixed1(); // Can't overflow
    }
    function reciprocal(int256 x) public pure returns (int256) {
        assert(x != 0);
        return (fixed1()*fixed1()) / x; // Can't overflow
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
    function multiply(int x, int y) public pure returns (int) {
        if (x == 0 || y == 0) return 0;
        if (y == fixed1()) return x;
        if (x == fixed1()) return y;

        // Separate into integer and fractional parts
        // x = x1 + x2, y = y1 + y2
        int x1 = integer(x) / fixed1();
        int x2 = fractional(x);
        int y1 = integer(y) / fixed1();
        int y2 = fractional(y);
        
        // (x1 + x2) * (y1 + y2) = (x1 * y1) + (x1 * y2) + (x2 * y1) + (x2 * y2)
        int x1y1 = x1 * y1;
        if (x1 != 0) assert(x1y1 / x1 == y1); // Overflow x1y1
        
        // x1y1 needs to be multiplied back by fixed1
        // solium-disable-next-line mixedcase
        int fixed_x1y1 = x1y1 * fixed1();
        if (x1y1 != 0) assert(fixed_x1y1 / x1y1 == fixed1()); // Overflow x1y1 * fixed1
        x1y1 = fixed_x1y1;

        int x2y1 = x2 * y1;
        if (x2 != 0) assert(x2y1 / x2 == y1); // Overflow x2y1

        int x1y2 = x1 * y2;
        if (x1 != 0) assert(x1y2 / x1 == y2); // Overflow x1y2

        x2 = x2 / mulPrecision();
        y2 = y2 / mulPrecision();
        int x2y2 = x2 * y2;
        if (x2 != 0) assert(x2y2 / x2 == y2); // Overflow x2y2

        // result = fixed1() * x1 * y1 + x1 * y2 + x2 * y1 + x2 * y2 / fixed1();
        int result = x1y1;
        result = add(result, x2y1); // Add checks for overflow
        result = add(result, x1y2); // Add checks for overflow
        result = add(result, x2y2); // Add checks for overflow
        return result;
    }
    function divide(int x, int y) public pure returns (int) {
        if (y == fixed1()) return x;
        assert(y != 0);
        assert(y <= maxFixedDivisor());
        return multiply(x, reciprocal(y));
    }
}
