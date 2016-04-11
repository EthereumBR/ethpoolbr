import config from 'config';
import rpc from 'json-rpc2';
import logger from './log';
import utils from './utils';
import EthProxyRPC from './ethproxyrpc';
import {ClientList} from './client';
import JobHandler from './jobhandler';

// config data
var HOST = config.get('server.host');
var PORT = config.get('server.port');
var IPCPATH = config.get('eth.ipcpath');

// create client list
var clientList = new ClientList();
// create job handler
var jobhandler = new JobHandler(clientList);
// create eth-proxy rpc handler
var ethproxyrpc = new EthProxyRPC(clientList, jobhandler);
// create RPC server
var server = rpc.Server.$create();

// expose functions
server.expose('eth_submitLogin', ethproxyrpc.submitLogin.bind(ethproxyrpc));
server.expose('eth_getWork', ethproxyrpc.getWork.bind(ethproxyrpc));
server.expose('eth_submitWork', ethproxyrpc.submitWork.bind(ethproxyrpc));
server.expose('eth_submitHashrate', ethproxyrpc.submitHashrate.bind(ethproxyrpc));
// listen creates an HTTP server on localhost only
server.listenRaw(PORT, HOST);

// start job handler
jobhandler.start();

logger.info('Server running at %s:%d', HOST, PORT);
logger.info('Eth backend IPC path is %s', IPCPATH);
