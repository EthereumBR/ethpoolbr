import logger from './log';

// list of connected clients
var clients = new Map();
// current number of connections
var connCount = 0;

// client login
export function eth_submitLogin(args, conn, cb) {
	if (args.length < 2) {
		cb('Invalid arguments', false);
	}
	var wallet = args[0];
	var email = args[1];

	logger.debug("Client connected:");
	logger.debug("  IP: " + conn.conn.address().address);
	logger.debug("  PORT: " + conn.conn.address().port);
	logger.debug("  Wallet: " + wallet);
	logger.debug("  Email: " + email);
	if (conn.lastmsg.hasOwnProperty('worker')) {
		// gets worker name if available
		logger.debug("  Client: " + conn.lastmsg.worker);
	}
	// check if client is already listed
	var cli = clients.get(wallet);
	if (cli) {
		// adds new connection to list
		cli.conns.push(conn);
	} else {
		// adds client connection to list
		clients.set(wallet, {
			wallet: wallet,
			conns: [conn]
		});
	}
	// set listener to remove connection from list when socket is closed
	conn.on('close', (hadError) => {
		logger.debug("client %s disconnected.", wallet)
		// get client data
		var cli = clients.get(wallet);
		// get connection index
		var i = cli.conns.indexOf(conn);
		if (i > -1) {
			// remove connection from list
			cli.conns.splice(i, 1);
			connCount--;
		} else {
			// connection wasn't listed (shouldn't happen!)
			logger.warn("Connection was not listed for wallet %s!", wallet);
		}
		// check if it was the last connection
		if (cli.conns.length == 0) {
			logger.debug("removing %s from list.", wallet)
			// remove client from list
			clients.delete(wallet);
		}
	});
	// adds client data to connection object
	conn.clidata = clients.get(wallet);
	// increment connections counter
	connCount++;
	logger.info("Wallets connected: %d", clients.size);
	logger.info("Total connections: %d", connCount);
	// return success
	cb(null, true);
}

// client (eth-proxy) pings
export function eth_getWork(args, conn, callback) {
	// TODO: Implement this to support direct miner connection
	logger.debug("client ping (%s)", conn.clidata.wallet);
	callback(null, true);
}

// client work submission
export function eth_submitWork(args, conn, callback) {
	// TODO: Implement this!
	callback(null, true);
}

// client hashrate submission
export function eth_submitHashrate(args, conn, callback) {
	// TODO: Implement this!
	logger.debug()
	callback(null, true);
}
