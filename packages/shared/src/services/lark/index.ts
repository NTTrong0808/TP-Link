import { LarkBotUrls } from "./constants";

export interface ILarkService {
  sendMessage(botUrl: LarkBotUrls, data: string): Promise<any>;
  getLogMessage(params: ILarkLogMessageParams): string;
}

export interface ILarkMessagePayload {
  msg_type: "text";
  content: {
    text: string;
  };
}

export interface ILarkLogMessageParams {
  type: "INBOUND" | "OUTBOUND";
  serviceName: string;
  status: "✅ Thành công" | "❌ Thất bại";
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
}

export class LarkService {
  static async sendMessage(botUrl: LarkBotUrls, data: string): Promise<any> {
    const payload: ILarkMessagePayload = {
      msg_type: "text",
      content: {
        text: data,
      },
    };

    try {
      const response = await fetch(botUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
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
      return { error: "send_to_lark", message: error?.message };
    }
  }

  static getLogMessage(params: ILarkLogMessageParams): string {
    const logMessage = `
📌 [${params.type}] [${params.serviceName}] – ${params.status}

🕒 Thời gian: ${params.time}
🔗 Endpoint: ${params.endpoint}
🎯 Action: ${params.action}

📤 Request:
${JSON.stringify(params.request, null, 2)}

📥 Response:
${JSON.stringify(params.response, null, 2)}

🧾 Trace ID: ${params.traceId || "-"}
👤 Triggered by: ${params.triggeredBy || "-"}
📝 Ghi chú: ${params.note || "-"}
  `;
    return logMessage;
  }
}
