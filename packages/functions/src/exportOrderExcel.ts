import { request } from 'undici';
import { SQSEvent } from 'aws-lambda';
import { OrderService } from '../shared/order.service';

export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    const body = JSON.parse(record.body) as any;
    try {
      const orderService = new OrderService();
      await orderService.getExcelOrders({
        filters: body?.filters,
        receiverEmail: body?.receiverEmail,
      });
    } catch (error) {
      console.error('Error handle Export excel sent to NestJS:', error);
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ res: 'ok' }),
  };
}
