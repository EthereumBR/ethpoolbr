config = {
    sharesPeriodMinutes: 60, //aggregate shares per hour 
    sharesPeriodMaxSize: 48, //2 days 
    workersInactiveMaxHours: 48, //2 days     
};
accounts = {
    "0xWalletAddressOfTheMiner": {
            totalShares: 1032576, //incremented when saveValidShare increments the workers[workerName].totalShares and the sharesPerPeriod in the current period
            paidShares: 1032512, //added amountShares when setPaidShares registers txid in sharesPaymentTrasnsactions array with amountShares
            totalPaid: 123.343631264, //added amoutEther when setPaidShares registers txid in sharesPaymentTrasnsactions array with amountShares
            sharesPaymentTrasnsactions: {
                 "0xThatBigHashThatRepresentsAnTransaction": 97, //latestTransaction
                 "0xThatBigHashThatRepresentsAnTransaction1": 34,
                 "0xThatBigHashThatRepresentsAnTransaction2": 25,  
                 //(...) older transactions
            },
            sharesPerPeriod:{  //when addWorkerShare add a value it crops the array to CONFIG.sharesPeriodMaxSize
                      "15-04-2016 18:00": 12, //current period, key time calculated by CONFIG.sharesPeriodMinutes
                      "15-04-2016 17:00": 95,
                      "15-04-2016 16:00": 94,
                      "15-04-2016 15:00": 100, 
                      //(...) older periods
           },  
           workers = { //wo
              "someWorkerName": { 
                  lastActivity: "2015-04-15 17:31", //updated when worker sends hashrate, validshare or invalidshare.
                  invalidShares: 206,
                  validShares: 1032576,
                  meanHashrate: 102,
                  lastValidShare: "2015-04-15 17:30", //updated when saveValidShare
                  currentPeriodShares: 12,
                  lastPeriodShares: 95,
              },//(...)  
           },
    }, //(...)
};


blocksFound = {
    "124235": {time: "15-04-2015 18:11:25", total: 5.6, fees:0.6},
    //(...)
};

blocksPerPeriod = {
    "15-04-2016 17:00": {blocks: 12, uncles: 2, blocksEth:60, uncleEth:4.5, feesEth:4.214, shares:12463 , totalEth:68.714, paidEth:0},
    //(...)
}
currentPeriod = {"15-04-2016 18:00": {blocks: 12, uncles: 2, blocksEth:60, uncleEth:4.5, feesEth:4.214, shares:12463 , totalEth:68.714, paidEth:0}};

lastPayment = "15-04-2016 06:00";
unpaidPeriods = ["15-04-2016 18:00","15-04-2016 17:00", "15-04-2016 16:00", "15-04-2016 15:00"];

function getUnpaidPeriods(){
    return this.unpaidPeriods;
}

function getUnpaidEth(){
    unpaidEth = {};
    unpaidPeriods = this.getUnpaidPeriods();
    periodsEthPerShare = {}
    
    //calculates how much each share values in that period
    for(unpaidPeriod in unpaidPeriods){ 
       periodsEthPerShare[unpaidPeriod.key] = blocksPerPeriod[unpaidPeriod].totalEth / blocksPerPeriod[unpaidPeriod].shares;
    }
    
    accounts = this.getAccounts();
    for(account in accounts){
        unpaidShares = 0;
        for(unpaidPeriod in unpaidPeriods){
            //calculates how much earning in that period for that account
           unpaidShare += account.sharesPerPeriod[unpaidPeriod] * periodsEthPerShare[unpaidPeriod]; 
            
        }
        unpaidEth[account.key] = unpaidShares;
    }
    return unpaidEth;
}


paidShares = [
    "0xWalletAddressOfTheMiner" = {
       txid: "0xThatBigHashThatRepresentsAnTransaction",
       amountShares: 97,
       amountEther: 0.0302354322
    },//(...)
];


function saveValidShare(address,workerName,shareId){}; //returns if is accepted
function saveInvalidShare(address,workerName,shareId){}; //returns if is accepted
function getAccountData(address){};//{ return this.accounts[address];} 
function setPaidShares(paidShares){}; //





