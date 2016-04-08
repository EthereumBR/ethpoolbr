import rpc from 'json-rpc2';
import logger from './log';
import utils from './utils';
import {eth_submitLogin, eth_getWork, eth_submitWork} from './proxyrpc';

// create RPC server
var server = rpc.Server.$create();
// expose functions
server.expose('eth_submitLogin', eth_submitLogin);
server.expose('eth_getWork', eth_getWork);
server.expose('eth_submitWork', eth_submitWork);
// listen creates an HTTP server on localhost only
server.listenRaw(8008, 'localhost');

logger.info('Server running at http://127.0.0.1:8008/');
