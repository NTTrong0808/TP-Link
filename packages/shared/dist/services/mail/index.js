"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const path = __importStar(require("path"));
const sparkpost_1 = __importDefault(require("sparkpost"));
class MailService {
    constructor() {
        if (!process.env.SPARK_POST_KEY) {
            throw new Error('Missing SPARK_POST_KEY environment variable');
        }
        this.sparkPost = new sparkpost_1.default(process.env.SPARK_POST_KEY);
        this.fromEmail = {
            name: process.env.FROM_EMAIL_NAME || 'Langfarm Center',
            email: process.env.FROM_EMAIL || 'support@langfarmcenter.com',
        };
        this.templateBasePath = path.resolve(process.cwd(), 'packages/functions/shared/templates');
        this.imageBasePath = path.join(this.templateBasePath, 'assets/images');
    }
    async sendEmail(options) {
        try {
            const data = await this.sparkPost.transmissions.send(options);
            console.log('[MailService] Sent email successfully:', JSON.stringify(data));
            return true;
        }
        catch (error) {
            console.error('[MailService] Failed to send email:', error?.errors || error);
            return false;
        }
    }
    setSimpleOption(payload) {
        const { from = this.fromEmail, subject, html, to: address, attachments, } = payload;
        return {
            content: {
                from,
                subject,
                html,
                ...(attachments ? { attachments } : {}),
            },
            recipients: [{ address }],
        };
    }
    setExcelAttachmentOption(payload) {
        const { subject = 'Báo cáo Excel từ Langfarm Center', to, excelBuffer, fileName = 'report.xlsx', } = payload;
        const attachment = {
            name: fileName,
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            data: excelBuffer.toString('base64'),
        };
        return {
            content: {
                from: payload?.from ?? this.fromEmail,
                subject,
                html: payload.template,
                attachments: [attachment],
            },
            recipients: [{ address: to }],
        };
    }
}
exports.MailService = MailService;
//# sourceMappingURL=index.js.map