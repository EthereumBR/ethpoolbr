import config from 'config';
import fs from 'fs';
import net from 'net';
import Web3 from 'web3';
import logger from './log';

var web3 = new Web3();

// config data
var IPCPATH = config.get('eth.ipcpath');
var TIMEOUT = config.get('eth.timeout');
var SECPERSHARE = config.get('eth.secondsBetweenShares');

export default class JobHandler {
	constructor(clientsList) {
		// stores reference to client list
		this._clientList = clientsList;
		this._currentWork = [
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000000000000000000000000000000000000000000000000000000000000000',
			'0x0000000000000000000000000000000000000000000000000000000000000000'
		];
		this._filter = null;
	}

	get currentWork() { return this._currentWork; }

	start() {
		this._ethconnect(IPCPATH, TIMEOUT, (provider) => {
			logger.debug('Connected to eth backend.');
			// set new web3 provider
			web3.setProvider(provider);
			// callback to set sync state
			this._ethSync = web3.eth.isSyncing(this._setsync.bind(this));

			this._init();
		});
	}

	getWorkForClient(cli) {
		// build work package
		var work = this._currentWork;
		work[2] = cli.calculateTarget(work, SECPERSHARE);

		return work;
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
				logger.debug(
					'New work data: \n' +
					'\tHeader-hash: %s\n' +
					'\tSeedhash: %s\n' +
					'\tTarget: %s',
					data[0], data[1], data[2]
				);
				// sets current work
				this._currentWork = data;
				// call dispatcher
				this._dispatcher();
			}
		}
	}

	_dispatcher() {
		logger.debug('Dispatching jobs to clients...');
		this._clientList.forEach((cli) => {
			var work = this.getWorkForClient(cli);
			cli.sendWork(work);
		});
	}

	_setsync(error, sync) {
		if (!error) {
			if(sync === true) {
				logger.debug('Sync started.');
				// stop all callbacks but this
				web3.reset(true);
			} else if(sync) {
				logger.debug('Sync state: %d/%d/%d',
					sync.startingBlock, sync.currentBlock, sync.highestBlock);
			} else {
				logger.debug('Sync ended.');
				this._init();
			}
		}
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
