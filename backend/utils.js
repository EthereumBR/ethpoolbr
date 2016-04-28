import rpc from 'json-rpc2';

// json-rpc2 fixes

// TODO: Force disconnection on rpc error

rpc.Connection.$include({
    'sendReply': function ($super, err, result, id) {
		$super(err, result, id);
		// send EOL (needed by eth-proxy protocol)
		this.write('\n');
	},
	'call': function ($super, method, params, callback) {
		$super(method, params, callback);
		// send EOL (needed by eth-proxy protocol)
		this.write('\n');
	},
	'handleMessage': function ($super, msg) {
		// store last msg in connection object
		this.lastmsg = msg;
		$super(msg);
	}
});

Number.prototype.round = function(places) {
  return +(Math.round(this + 'e+' + places)  + 'e-' + places);
}
