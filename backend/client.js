import config from 'config';
import ethUtil from 'ethereumjs-util';
import BN from 'bn.js';
import logger from './log';

// config data
var DEFAULTMHS = config.get('eth.defaultmhs');

export class Client {
	constructor(wallet, conn, email, clientapp) {
		this.wallet = wallet;
		this.mhs = DEFAULTMHS;

		this._lastmhs = 0;
		this._lastsecpershare = 0;
		this._target = "0x0";

		this._connMap = new Map();
		this._connMap.set(conn, {
			email: email,
			app: clientapp
		});
	}

	addConnection(conn, email, clientapp) {
		var data = this._connMap.get(conn);
		if (data) {
			// connection was already added (shouldn't happen!)
			logger.warn('Connection already added. Updatind data...');
			data.email = email;
			data.clientapp = clientapp;
			return;
		}
		this._connMap.set(conn, {
			email: email,
			app: clientapp
		});
	}

	// removes connection from client
	// Returns true if it was the last connection
	removeConnection(conn) {
		var data = this._connMap.get(conn);
		if (!data) {
			// connection wasn't listed (shouldn't happen!)
			logger.warn('Connection was not listed for wallet %s!', this.wallet);
		} else {
			// remove connection from list
			this._connMap.delete(conn);
		}
		return (this._connMap.size == 0);
	}

	// send work to all connection from this client
	sendWork(work) {
		this._connMap.forEach((data, conn) => {
			conn.sendReply(null, work, 0);
		});
	}

	// calculate target difficulty for this client
	// heavily inspired by https://github.com/ming08108/EtherPool (shareHandler.js)
	calculateTarget(work, secpershare) {
		if ((this.mhs == this._lastmhs) && (this._secpershare == secpershare)) {
			// return cached target to avoid recalculation
			return this._target;
		}

		// get desired number of seconds between shares
		var sec = new BN(secpershare);
		// calculate hashes per second
		var hs = new BN(this.mhs * 1000).mul(new BN(1000));
		// total number of hashes before finding solution
		var th = sec.mul(hs);
		// calculate target for worker
		var target = ethUtil.TWO_POW256.div(th);
		// update cached values
		this._lastmhs = this.mhs;
		this._secpershare = secpershare;
		this._target = '0x' + target.toString(16, 64);

		return this._target;
	}
}

export class ClientList {
	constructor() {
		this._clients = new Map();
		this.connCount = 0;
	}

	get size() { return this._clients.size; }

	add(wallet, conn, email, clientapp) {
		// check if client is already listed
		var cli = this._clients.get(wallet);
		if (cli) {
			// adds new connection to client
			cli.addConnection(conn, email, clientapp);
		} else {
			// adds client to list
			cli = new Client(wallet, conn, email, clientapp);
			this._clients.set(wallet, cli);
		}
		// increment connections counter
		this.connCount++;
		// add client object to connection object
		conn.cliObj = cli;

		// set listener to remove connection from list when socket is closed
		conn.on('close', function (hadError) {
			logger.debug("client %s disconnected.", wallet)
			// get client data
			var cli = this._clients.get(wallet);
			// remove client if it was last connection
			if (cli.removeConnection(conn)) {
				logger.debug("removing %s from list.", wallet)
				this._clients.delete(wallet);
			}
			// remove client object from connection object
			conn.cliObj = null;
			// decrement connections counter
			this.connCount--;

			this.reportStatus();
		}.bind(this));

		this.reportStatus();

		return cli;
	}

	// iterate on clients in list
	forEach(cb) {
		this._clients.forEach((cli, wallet) => {
			cb(cli);
		});
	}

	// sends work to all clients in list
	sendWork(work) {
		this._clients.forEach((cli, wallet) => {
			cli.sendWork(work);
		});
	}

	getClientFromConn(conn) {
		if (conn && conn != null) {
			return (conn.cliObj) ?  conn.cliObj : null;
		}
		return null;
	}

	reportStatus() {
		logger.info("Wallets connected: %d", this.size);
		logger.info("Total connections: %d", this.connCount);
	}
}
