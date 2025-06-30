import { IsOptional, IsString } from "class-validator";

export class CancelInvoiceDto {
  @IsString() transactionID: string;

  @IsString() invSeries: string;

  @IsOptional() @IsString()
  cancelReason?: string;
}
