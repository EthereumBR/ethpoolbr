
pbppsconfig = {
    sharesPeriodMinutes: 60, //aggregate shares per hour 
    sharesPeriodMaxSize: 48, //2 days 
    workersInactiveMaxHours: 48, //2 days     
};

function getUnpaidEth(database){
    unpaidEth = {};
    unpaidPeriods = database.getUnpaidPeriods();
    periodsEthPerShare = {}
    
    //calculates how much each share values in that period
    for(unpaidPeriod in unpaidPeriods){ 
       periodsEthPerShare[unpaidPeriod.key] = blocksPerPeriod[unpaidPeriod].totalEth / blocksPerPeriod[unpaidPeriod].shares;
    }
    
    accounts = database.getUnpaidAccounts();
    for(account in accounts){
        unpaidShares = 0;
        for(unpaidPeriod in unpaidPeriods){
           //calculates how much earning in that period for that account
           unpaidShares += account.sharesPerPeriod[unpaidPeriod] * periodsEthPerShare[unpaidPeriod]; 
       
        }
        unpaidEth[account.key] = unpaidShares;
    }
    return unpaidEth;
}

function getCurrentPeriod(){ 
      //remove milliseconds, seconds, quotient with sharesPeriodMinutes and reconvert to minutes.
      return Math.floor(((new Date().getTime()/1000)/60)/pbppsconfig.sharesPeriodMinutes)*pbppsconfig.sharesPeriodMinutes;
}