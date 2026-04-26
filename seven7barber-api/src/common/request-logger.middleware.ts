import { Request, Response, NextFunction } from 'express';
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
});

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { method, originalUrl, ip } = req;
  const start = Date.now();

  res.on('finish', () => {
    const { statusCode } = res;
    const duration = Date.now() - start;
    logger.info(
      { context: 'RequestLogger' },
      `${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`,
    );
  });

  next();
}
