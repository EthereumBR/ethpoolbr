import config from 'config';
import fs from 'fs';
import net from 'net';
import Web3 from 'web3';
import logger from './log';

var web3 = new Web3();

// config data
var IPCPATH = config.get('eth.ipcpath');
var TIMEOUT = config.get('eth.timeout');

export default class JobHandler {
	constructor(clients) {
		// stores reference to client list
		this._clients = clients;
		this._connected = false;
		this._syncing = false;
		this._currentWork = {};
		this._filter = null;
	}

	start() {
		this._ethconnect(IPCPATH, TIMEOUT, (provider) => {
			logger.debug('Connected to eth backend.');
			// restart if connection fails
			// provider.connection.on('close', this._restart.bind(this))
			// set new web3 provider
			web3.setProvider(provider);
			// set state as connected
			this._connected = true;
			// callback to set sync state
			this._ethSync = web3.eth.isSyncing(this._setsync.bind(this));

			this._init();
		});
	}

	sendJob(conn) {
		conn.sendReply(null, this._currentWork, 0);
	}

	_init() {
		// get initial work
		web3.eth.getWork(this._getWork.bind(this));
		// get filter for new blocks
		this._filter = web3.eth.filter('latest');
		// add new block watcher
		this._filter.watch(this._newblock.bind(this));
	}

	_newblock(hash) {
		logger.debug('New block! Getting new work data...');
		web3.eth.getWork(this._getWork.bind(this));
	}

	_getWork(error, data) {
		if (error) {
			logger.error('Error getting work: %s', error);
			// retrying
			web3.eth.getWork(this._getWork.bind(this));
		} else {
			if (this._currentWork != data) {
				logger.debug('New work data: ', data);
				// sets current work
				this._currentWork = data;
				// call dispatcher
				this._dispatcher();
			}
		}
	}

	_dispatcher() {
		logger.debug('Dispatching jobs to clients...');
		this._clients.forEach((value, key) => {
			value.conns.forEach((conn) => {
				// notify all clients of work
				this.sendJob(conn);
			});
		});
	}

	_setsync(error, sync) {
		if (!error) {
			if(sync === true) {
				logger.debug('Sync started.');
				// stop all callbacks but this
				web3.reset(true);
				this._syncing = true;
			} else if(sync) {
				logger.debug('Sync state: %d/%d/%d',
					sync.startingBlock, sync.currentBlock, sync.highestBlock);
			} else {
				logger.debug('Sync ended.');
				this._syncing = false;
				this._init();
			}
		}
	}

	_restart() {
		logger.error('Disconnected from eth backend. Retrying...');
		// set state as not connected
		this._connected = false;
		// this._ethSync.stopWatching();
		// reset web3 state
		// web3.reset();
		// delete web3.currentProvider;
		// web3.setProvider(null);
		this._currentWork = {};

		// restart job handler
		// this.start();
	}

	_ethconnect(path, timeout, cb) {
		logger.debug('Trying to connect to eth backend at %s...', path);
		try {
			// check if ipc path exists
	    	fs.accessSync(path, fs.F_OK);
			// get new provider
			var provider = new Web3.providers.IpcProvider(IPCPATH, net);
			// callback whoever is waiting for this
			cb(provider);
		} catch (e) {
			logger.error('Failed to connect to eth backend. Retrying...');
			setTimeout(this._ethconnect.bind(this), timeout, path, timeout, cb);
		}
	}


}
