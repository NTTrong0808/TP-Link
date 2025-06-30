import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Invoice, InvoiceSchema } from './schemas/invoice.schema'
import { InvoiceService } from './invoice.service'
import { InvoiceController } from './invoice.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }])],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoiceModule {}
