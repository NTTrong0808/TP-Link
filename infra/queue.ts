function createQueue({ name, delay, handler }: QueueConfig): sst.aws.Queue {
  const queue = new sst.aws.Queue(name, {
    delay,
    visibilityTimeout: '15 minutes',
  });
  queue.subscribe({
    handler,
    timeout: '15 minutes',
    environment: {
      SPARK_POST_KEY: process.env.SPARK_POST_KEY,
      FROM_EMAIL_NAME: process.env.FROM_EMAIL_NAME,
      FROM_EMAIL: process.env.FROM_EMAIL,
      DB_MONGO_URI: process.env.DB_MONGO_URI,
    },
  });
  queue.url.apply((value: any) => {
    console.log(`${name}: ${value}`);
  });
  return queue;
}

const bookingQueue = createQueue({
  name: 'BookingQueue',
  delay: '3 seconds',
  handler: 'packages/functions/src/handleBooking.handler',
});
const issueTicketQueue = createQueue({
  name: 'IssueTicketQueue',
  delay: '3 seconds',
  handler: 'packages/functions/src/issueTicket.handler',
});
const exportExcelBookings = createQueue({
  name: 'ExportExcelBookings',
  delay: '3 seconds',
  handler: 'packages/functions/src/exportBookingExcel.handler',
});
const exportExcelOrders = createQueue({
  name: 'ExportExcelOrders',
  delay: '3 seconds',
  handler: 'packages/functions/src/exportOrderExcel.handler',
});
export const queues = [
  bookingQueue,
  issueTicketQueue,
  exportExcelBookings,
  exportExcelOrders,
];
