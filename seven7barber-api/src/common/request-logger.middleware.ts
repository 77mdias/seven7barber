import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerServiceImpl } from './logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private logger = new LoggerServiceImpl();

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, ip } = req;
    const start = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`,
        'RequestLogger'
      );
    });

    next();
  }
}