import rpc from 'json-rpc2';

// json-rpc2 fixes
rpc.Connection.$include({
    'sendReply': function ($super, err, result, id) {
		$super(err, result, id);
		// send EOL (needed by eth-proxy protocol)
		this.write("\n");
	},
	'call': function ($super, method, params, callback) {
		$super(method, params, callback);
		// send EOL (needed by eth-proxy protocol)
		this.write("\n");
	},
	'handleMessage': function ($super, msg) {
		// store last msg in connection object
		this.lastmsg = msg;
		$super(msg);
	}
});
