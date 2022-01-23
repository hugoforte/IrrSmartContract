# IrrSmartContract

## Dependencies

## Trade-offs
- Did a rudamentary math library - it sucks - power only supports whole numbers
- Only supports -1 > IRR's < 1, assumes returns are decimals up to precision of 5 decimals
- Will only accept whole dollar amounts for cashflows
	- Could be refactored to do cents - but value of that is probably negligble
- Not matching to the excel IRR - which returns 20 for the given cashflows, but I am instead using the NewtonRaphson method - 
- Initial guess is not optimal, it uses first years return if not passed in
	- Implementing the improved initial guess in the paper above instead of the naive first years return. - from this paper: https://www.researchgate.net/publication/338749495_Calculating_Internal_Rate_of_Return_IRR_in_Practice_using_Improved_Newton-Raphson_Algorithm

## Releases
0.2 - created function definition and static test
Time spent ~45 min: 08:34 - 09:15
- [x] Create stub function `function irr(int[] memory values, int guess) external pure returns(int)` that returns a static variable
- [x] Set up a passing test

0.1 - hello world and test framework
Time spent ~1hr: 07:31 - 08:32
- [x] Decide on [[ganache-cli]] vs [[Hardhat]] - decided on HardHat
- [x] Create a hello world smart contract
- [x] Set up a test framework and create a hello world test
- [x] Cleaned up references