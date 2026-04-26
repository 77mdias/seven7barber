export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
        uptime: number;
    };
    liveness(): {
        status: string;
    };
    readiness(): {
        status: string;
    };
}
