export declare class MetricsController {
    private requestCount;
    private startTime;
    getMetrics(): {
        requests: number;
        uptime_seconds: number;
        memory: NodeJS.MemoryUsage;
        cpu: NodeJS.CpuUsage;
    };
}
