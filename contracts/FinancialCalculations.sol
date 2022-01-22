pragma solidity ^0.8.0;


contract FinancialCalculations {
    //Number of decimals supported
    int public constant precision = 10;
    
    function irr(int[] memory cashFlows, int guess) public pure returns(int){
        int retVal = 2 * precision;
        return retVal;
    }
}
