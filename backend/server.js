import config from 'config';
import rpc from 'json-rpc2';
import logger from './log';
import utils from './utils';
import {
	setJobHandler, clients,
	eth_submitLogin, eth_getWork,
	eth_submitWork, eth_submitHashrate
} from './proxyrpc';
import JobHandler from './jobhandler';

// config data
var HOST = config.get('server.host');
var PORT = config.get('server.port');
var IPCPATH = config.get('eth.ipcpath');

// create RPC server
var server = rpc.Server.$create();
// create job handler
var jobhandler = new JobHandler(clients);

// TODO: fix this, it's terrible!
setJobHandler(jobhandler);

// expose functions
server.expose('eth_submitLogin', eth_submitLogin);
server.expose('eth_getWork', eth_getWork);
server.expose('eth_submitWork', eth_submitWork);
server.expose('eth_submitHashrate', eth_submitHashrate);
// listen creates an HTTP server on localhost only
server.listenRaw(PORT, HOST);

// start job handler
jobhandler.start();

logger.info('Server running at %s:%d', HOST, PORT);
logger.info('Eth backend IPC path is %s', IPCPATH);
