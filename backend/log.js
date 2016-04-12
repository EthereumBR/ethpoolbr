import config from 'config';
import winston from 'winston';

// config data
var LOGLEVEL = config.get('log.level');

// configure default log instance
export default new (winston.Logger)({
  transports: [new (winston.transports.Console)({
		level: LOGLEVEL,
		colorize: true,
		timestamp: true,
		prettyPrint: true
	})]
});
