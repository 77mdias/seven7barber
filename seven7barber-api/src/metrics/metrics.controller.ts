import { Controller, Get } from '@nestjs/common';

@Controller('metrics')
export class MetricsController {
  private requestCount = 0;
  private startTime = Date.now();

  @Get()
  getMetrics() {
    return {
      requests: this.requestCount,
      uptime_seconds: Math.floor((Date.now() - this.startTime) / 1000),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
    };
  }
}