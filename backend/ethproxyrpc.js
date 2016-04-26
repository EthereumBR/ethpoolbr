import logger from './log';

export default class EthProxyRPC {
	constructor(clientList, jobhandler) {
		this._clientList = clientList;
		this._jobhandler = jobhandler;
	}

	submitLogin(args, conn, cb) {
		if (args.length < 2) {
			cb('Invalid arguments', false);
		}
		var wallet = args[0];
		var email = args[1];
		var clientapp = (conn.lastmsg.hasOwnProperty('worker')) ? conn.lastmsg.worker : '';

		logger.debug('eth_submitLogin from %s...', wallet);

		logger.debug('Client connected:');
		logger.debug('  IP: ' + conn.conn.address().address);
		logger.debug('  PORT: ' + conn.conn.address().port);
		logger.debug('  Wallet: ' + wallet);
		logger.debug('  Email: ' + email);
		logger.debug('  ClientApp: ' + clientapp);

		// add client to list
		var cli = this._clientList.add(wallet, conn, email, clientapp);
		// return success
		cb(null, true);
	}

	// client (eth-proxy) eth_getWork handler
	getWork(args, conn, cb) {
		// TODO: Implement this to support direct miner connection
		var cli = this._checkClientListed(conn, cb, 'eth_getWork from');
		if (cli == null) return;

		logger.debug('eth_getWork from %s', cli.wallet);
		// return current work to client
		cb(null, this._jobhandler.getWorkForClient(cli));
	}

	// client work submission
	submitWork(args, conn, cb) {
		var cli = this._checkClientListed(conn, cb, 'submitWork from');
		if (cli == null) return;

		var worker = "";
		if (conn.lastmsg.hasOwnProperty('worker')) {
			worker = conn.lastmsg.worker;
		}
		logger.debug('eth_submitWork from %s@%s', worker, cli.wallet);
    logger.debug('  Nonce: %s', args[0]);
    logger.debug('  Header-hash: %s', args[1]);
    logger.debug('  Mixhash: %s', args[2]);

    var valid = this._jobhandler.submitShareFromClient(cli, worker, args);

    cb(null, valid);
	}

	// client hashrate submission
	submitHashrate(args, conn, cb) {
		var cli = this._checkClientListed(conn, cb, 'submitHashrate from');
		if (cli == null) return;

		// TODO: Implement this!
		var worker = "";
		if (conn.lastmsg.hasOwnProperty('worker')) {
			worker = conn.lastmsg.worker + '@';
		}

		var mhs = parseInt(args[0], 16) / 1000000;
		logger.debug('eth_submitHashrate from %s%s (%s MH/s)', worker, cli.wallet, mhs);
		cb(null, true);
	}

	_checkClientListed(conn, cb, errmsg) {
		var cli = this._clientList.getClientFromConn(conn);
		if (cli == null) {
			logger.error('%s unlisted client! Disconnecting...', errmsg);
			cb('invalid client (maybe not stratum?)', null);
			conn.end();
			return null;
		}
		return cli;
	}
}
