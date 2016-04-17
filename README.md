[![Gitter](https://badges.gitter.im/EthereumBR/ethpoolbr.svg)](https://gitter.im/EthereumBR/ethpoolbr?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![License](http://img.shields.io/:license-mit-blue.svg)](http://doge.mit-license.org)
![Version Pre-alpha](https://img.shields.io/badge/version-pre--alpha-red.svg)

## EthPoolBR
An open source Ethereum pool optimized for efficiency and transparency with fair flexible payment system. The project will be mainly in javascript, but bindings may be used to improve performance of ethash.

### Payment System
We are abstracting the payment system to be able to anyone easily extend your own payment system and we are basing it on Period Based Pay Per Share (PBPPS) that can be configured in minutes or dynamically changed based on ethereum network variables, like blocktime.
The miners are paid proportionally to the shares accepted in the configured period.  
The proportion is calculated by 
````
aPeriod.ethEarningsPerShare = aPeriod.totalEthEarned / aPeriod.totalAcceptedShares;
aMiner.balance += aMiner.periodShares[aPeriod.key]*aPeriod.ethEarningsPerShare;
```` 

## EthereumBR Team
This organization is informal and was created to unite developers in Brazil interested in working on open source project for Ethereum technology. We started this idea in Facebook Community (https://www.facebook.com/groups/ethereum.brasil/) that is a big open community.  
The contributors list will be added when the project get its first running version.

### Motivation
We want to contribute on the Ethereum democracy revolution following the most of it's essence, that is community.
