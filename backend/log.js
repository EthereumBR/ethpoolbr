import winston from 'winston';

// configure default log instance
export default new (winston.Logger)({
  transports: [new (winston.transports.Console)({
		level: 'debug',
		colorize: true,
		timestamp: true,
		prettyPrint: true
	})]
});
