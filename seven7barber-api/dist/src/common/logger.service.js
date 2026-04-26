"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerServiceImpl = void 0;
const common_1 = require("@nestjs/common");
const pino_1 = __importDefault(require("pino"));
let LoggerServiceImpl = class LoggerServiceImpl {
    logger = (0, pino_1.default)({
        level: process.env.LOG_LEVEL || 'info',
    });
    log(message, context) {
        this.logger.info({ context }, message);
    }
    error(message, trace, context) {
        console.error('LOGGER ERROR:', message, trace, context);
        this.logger.error({ context, trace }, message);
    }
    warn(message, context) {
        this.logger.warn({ context }, message);
    }
    debug(message, context) {
        this.logger.debug({ context }, message);
    }
};
exports.LoggerServiceImpl = LoggerServiceImpl;
exports.LoggerServiceImpl = LoggerServiceImpl = __decorate([
    (0, common_1.Injectable)()
], LoggerServiceImpl);
//# sourceMappingURL=logger.service.js.map