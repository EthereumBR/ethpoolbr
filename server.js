import rpc from 'json-rpc2';

rpc.Connection.$include({
    'sendReply': function($super, err, result, id) {
		var data = JSON.stringify({
          jsonrpc: '2.0',
          result : result,
          error  : err,
          id     : id
        });

        this.write(data + "\n");
	}
});

var server = rpc.Server.$create();

var clients = {};

function eth_submitLogin(args, conn, callback) {
	console.log("Client connected:");
	console.log("  IP: " + conn.conn.address().address);
	console.log("  PORT: " + conn.conn.address().port);
	console.log("  Wallet: " + args[0]);
	console.log("  Email: " + args[1]);
	callback(null, true)
}

function eth_getWork(args, conn, callback) {
	callback(null, true);
}

server.expose('eth_submitLogin', eth_submitLogin);
server.expose('eth_getWork', eth_getWork);

// listen creates an HTTP server on localhost only
server.listenRaw(8008, 'localhost');

console.log('Server running at http://127.0.0.1:8008/');
