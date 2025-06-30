import { LarkBotUrls } from './constants';
export declare class LarkService {
    static sendMessage(botUrl: LarkBotUrls, data: string): Promise<any>;
    static getLogMessage({ type, serviceName, status, time, endpoint, action, request, response, traceId, triggeredBy, note, }: {
        type: 'INBOUND' | 'OUTBOUND';
        serviceName: string;
        status: '✅ Thành công' | '❌ Thất bại';
        time: string;
        endpoint: string;
        action: string;
        request?: {
            method: string;
            headers: Record<string, any>;
            body: any;
        };
        response?: Record<string, any>;
        traceId?: string;
        triggeredBy?: string;
        note?: string;
    }): string;
}
//# sourceMappingURL=index.d.ts.map