"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LarkService = void 0;
class LarkService {
    static async sendMessage(botUrl, data) {
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
                throw new Error(`LarkBot API responded with status ${response.status}: ${errorText}`);
            }
            return await response.json();
        }
        catch (error) {
            return { error: 'send_to_lark', message: error?.message };
        }
    }
    static getLogMessage({ type, serviceName, status, time, endpoint, action, request, response = {}, traceId, triggeredBy, note, }) {
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
exports.LarkService = LarkService;
//# sourceMappingURL=index.js.map