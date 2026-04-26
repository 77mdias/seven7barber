"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLoggerMiddleware = requestLoggerMiddleware;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || 'info',
});
function requestLoggerMiddleware(req, res, next) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();
    res.on('finish', () => {
        const { statusCode } = res;
        const duration = Date.now() - start;
        logger.info({ context: 'RequestLogger' }, `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`);
    });
    next();
}
//# sourceMappingURL=request-logger.middleware.js.map