import { LarkBotUrls } from './constants';

export class LarkService {
  static async sendMessage(botUrl: LarkBotUrls, data: string): Promise<any> {
    const payload = {
      msg_type: 'text',
      content: {
        text: data,
      },
    };

    try {
      const response = await fetch(botUrl, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `LarkBot API responded with status ${response.status}: ${errorText}`
        );
      }

      return await response.json();
    } catch (error: any) {
      return { error: 'send_to_lark', message: error?.message };
    }
  }

  static getLogMessage({
    type,
    serviceName,
    status,
    time,
    endpoint,
    action,
    request,
    response = {},
    traceId,
    triggeredBy,
    note,
  }: {
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
  }) {
    const logMessage = `
📌 [${type}] [${serviceName}] – ${status}

🕒 Thời gian: ${time}
🔗 Endpoint: ${endpoint}
🎯 Action: ${action}

📤 Request:
${JSON.stringify(request, null, 2)}

📥 Response:
${JSON.stringify(response, null, 2)}

🧾 Trace ID: ${traceId || '-'}
👤 Triggered by: ${triggeredBy || '-'}
📝 Ghi chú: ${note || '-'}
  `;
    return logMessage;
  }
}
