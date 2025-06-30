import { request } from 'undici';
import { SQSEvent } from 'aws-lambda';

/**
 * After confirm booking
 * @param event
 */
export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    const bookingData = JSON.parse(record.body);
    console.log('Booking data:', bookingData);
    try {
      if (!bookingData?.bookingId) {
        continue;
      }
      const { body } = await request(
        `${bookingData?.baseUrl}/meinvoice/issue/${bookingData?.bookingId}`,
        { method: 'POST' }
      );
      const res = await body.json();
      console.log('Booking created:', res);
    } catch (error) {
      console.error('Error handle booking sent to NestJS:', error);
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ res: 'ok' }),
  };
}
