[![Gitter](https://badges.gitter.im/EthereumBR/ethpoolbr.svg)](https://gitter.im/EthereumBR/ethpoolbr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
![Version Pre-alpha](https://img.shields.io/badge/version-pre--alpha-red.svg)

#### Attention! **This is not woking yet! It's pre-alpha.** No deploy scripts provided for now. Use at your own risk.

## EthPoolBR
An open-source Ethereum pool optimized for efficiency and transparency with a fair and flexible payment system. This project is written in javascript for node and uses bindings to improve [ethash](https://github.com/ethereumjs/node-ethash) performance.

### Payment System
A modular payment system allows for easy customization of the payout scheme. Default is Period Based Pay Per Share (PBPPS), with configurable payment interval in minutes or dynamically adjusted based on Ethereum network variables, like block time. The miners are paid proportionally to the valid shares submitted during the configured interval.

Payment is calculated as follows:
````
aPeriod.ethEarningsPerShare = aPeriod.totalEthEarned / aPeriod.totalAcceptedShares;
aMiner.balance += aMiner.periodShares[aPeriod.key]*aPeriod.ethEarningsPerShare;
````

### VarDiff
The difficulty of work sent to miners is calculated dynamically, depending on their hash power. With the default configuration (`config/default.json`), this is adjusted so that every miner produces one valid share every ~100 seconds (`eth.secondsBetweenShares`). It takes approximately 15 minutes to calculate the miner's hash rate properly (`eth.windowMinutesUpdateMHS`). 

## EthereumBR Team
This informal organization was created to unite developers from Brazil interested in working with open source Ethereum technology. This idea was born inside [ethereum Brasil facebook community](https://www.facebook.com/groups/ethereum.brasil/). The [contributors list](https://github.com/EthereumBR/ethpoolbr/wiki/Developers) will be updated when the project gets its first release.

### Motivation
We want to contribute to Ethereum's potential for social, economic and democratic revolution, having the community at its core.
