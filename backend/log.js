import config from 'config';
import winston from 'winston';

// configure default log instance
export default new (winston.Logger)({
  transports: [new (winston.transports.Console)({
		level: config.get('log.level'),
		colorize: true,
		timestamp: true,
		prettyPrint: true
	})]
});
