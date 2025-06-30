import { Attachment, CreateTransmission } from 'sparkpost';
export type ILCMailContent = {
    from?: string;
    subject: string;
    html: string;
    to: string;
    attachments?: Attachment[];
};
export declare class MailService {
    private sparkPost;
    private fromEmail;
    private templateBasePath;
    private imageBasePath;
    constructor();
    sendEmail(options: CreateTransmission): Promise<boolean>;
    setSimpleOption(payload: ILCMailContent): CreateTransmission;
    setExcelAttachmentOption(payload: {
        to: string;
        subject?: string;
        excelBuffer: Buffer;
        fileName?: string;
        from?: string;
        template: string;
    }): CreateTransmission;
}
//# sourceMappingURL=index.d.ts.map