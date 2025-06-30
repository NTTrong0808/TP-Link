import { SQSClient, SendMessageCommand, GetQueueUrlCommand } from '@aws-sdk/client-sqs'
import { Injectable, Logger } from '@nestjs/common'
import { Resource } from 'sst'
export type QUEUE_NAME = 'BookingQueue' | 'MailQueue' | 'IssueTicketQueue' | 'ExportExcelBookings' | 'ExportExcelOrders'

declare module 'sst' {
  export interface Resource {
    BookingQueue: {
      type: 'sst.aws.Queue'
      url: string
    }
    IssueTicketQueue: {
      type: 'sst.aws.Queue'
      url: string
    }
    ExportExcelBookings: {
      type: 'sst.aws.Queue'
      url: string
    }
    ExportExcelOrders: {
      type: 'sst.aws.Queue'
      url: string
    }
  }
}

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name)
  private sqsClient: SQSClient
  private queueUrls: Record<string, string> = {}

  constructor() {
    this.sqsClient = new SQSClient({})
  }

  async sendMessage(queueName: QUEUE_NAME, messageBody: any) {
    this.queueUrls = {
      BookingQueue: Resource.BookingQueue.url,
      IssueTicketQueue: Resource.IssueTicketQueue.url,
      ExportExcelBookings: Resource.ExportExcelBookings.url,
      ExportExcelOrders: Resource.ExportExcelOrders.url,
    }
    const queueUrl = this.queueUrls?.[queueName]
    console.log('queueUrl', queueUrl)

    if (!queueUrl) {
      throw new Error(`Queue ${queueName} not found.`)
    }

    const params = {
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(messageBody),
    }

    await this.sqsClient.send(new SendMessageCommand(params))
    console.log(`Message sent to ${queueName}:`, messageBody)
  }
}
