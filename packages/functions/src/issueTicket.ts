import { request } from "undici";
import { SQSEvent } from "aws-lambda";

/**
 * Handle for IssueTicketQueue 
 * @param event 
 */
export async function handler(event: SQSEvent) {
  for (const record of event.Records) {
    const bookingData = JSON.parse(record.body);
    console.log("Issue ticket data:", bookingData);
    try {
      const { bookingId } = bookingData
      if (!bookingId) {
        continue
      }
      const { body } = await request(`${bookingData?.baseUrl}/issued-tickets`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookingId }), 
      });
      const res = await body.json();
      console.log("Issue created:", res);
    } catch (error) {
      console.error("Error handle booking sent to NestJS:", error);
    }
  }  
  return {
    statusCode: 200,
    body: JSON.stringify({ res: 'ok' }),
  }
}
