# IrrSmartContract
- Finished IRR calculation, described and tested in IrrTest.js
- Time spent: about 20 hours
- Biggest hurdles
	- Math - I created an implementation in c# in about an hour or two, then tried to convert that project to use just ints - this was miserable, ended up doing research on fixed point math with solidity and took pieces of a math library and added what I needed to it.
	- Not knowing solidity - not having done anythign in solidity before I had a bit of an uphill battle deciding on tooling for development, running tests etc. I would have liked to write the tests in solidity as well, but ended up going with the defaults provided by hardhat.
- Not finished
	- Role based permissions
		- Was going to implement based on this article: https://micha-roon.medium.com/limiting-access-in-smart-contracts-11b82d761931 to offload the managements of users and groups to a separate contract. I did not have time to implement this unfortunately
	- Breaking calculation before max iterations - the hasPoloynomialConverged is unfortunately not working at the moment, this would be my first fix.
	- Gas estimation - Remix calculated it it be infinite based on the looping, I did not have time to dig deeper into this.

## Dependencies and running
- Node
- Hardhat

to run from directory: `npx hardhat test`

## Trade-offs
- Extremely inefficient - I've done no optimizations at all - takes 10 seconds to run (c# code runs in milliseconds). Assuming this is based on the way I'm performing math.
- Ported and extended a rudamentary math library that splits the int and decimal values
- Made all functions public for testing purposes - not something I'd do with productionalized code
- Only supports return value of -1 > IRR < 1, assumes int portion of 0 and just returns the decimal portion
	- Would include a better math library to deal with this.
- Will only accept whole dollar amounts for cashflows
	- Could be refactored to do cents - but value of that is probably negligble
- Not matching to the excel IRR - which returns 0.2 for the given cashflows, but I am instead using the NewtonRaphson method which is more accurate in my research.
- Passing in initial guess is not optimal in my opinion, 
	- Can be improved by Implementing the improved initial guess. From this paper: https://www.researchgate.net/publication/338749495_Calculating_Internal_Rate_of_Return_IRR_in_Practice_using_Improved_Newton-Raphson_Algorithm

## Releases
0.3 - Created IRR implementation
Time spent ~6 hours(!)
- [x] Create implmentation


0.3 - Created math functions
Time spent ~10 hours(!)
- [x] Create add, subtract, divide, multiply by porting from article
- [x] Add power function
- [x] Add abs function


0.2 - created function definition and static test
Time spent ~45 min: 08:34 - 09:15
- [x] Create stub function `function irr(int[] memory values, int guess) external pure returns(int)` that returns a static variable
- [x] Set up a passing stub test


0.1 - hello world and test framework
Time spent ~1hr: 07:31 - 08:32
- [x] Decide on [[ganache-cli]] vs [[Hardhat]] - decided on HardHat
- [x] Create a hello world smart contract
- [x] Set up a test framework and create a hello world test
- [x] Cleaned up references
