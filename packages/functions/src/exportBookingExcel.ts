import { SQSEvent } from 'aws-lambda';
import { BookingService } from '../shared/booking.service';

export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    const body = JSON.parse(record.body) as any;
    try {
      const bookingService = new BookingService();
      await bookingService.getExcelBookings({
        currentUser: body?.currentUser,
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
