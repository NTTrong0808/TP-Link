import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { transformId } from '@src/lib/helper/transform-id'
import { validateOrReject } from 'class-validator'
import { isValidObjectId, Model } from 'mongoose'
import { CreatePaymentMethodDto } from './dto/create.dto'
import { FilterPaymentMethodDto } from './dto/filter.dto'
import { UpdatePaymentMethodDto } from './dto/update.dto'
import { BankAccount, PaymentMethod } from './schema/payment-method.schema'

@Injectable()
export class PaymentMethodService {
  private readonly logger = new Logger(PaymentMethodService.name)

  constructor(@InjectModel(PaymentMethod.name) private paymentMethodModel: Model<PaymentMethod>) {}

  async findPaymentMethods({ type, available, paymentMethodType }: FilterPaymentMethodDto = {}) {
    try {
      const condition = {
        ...(type && type?.length > 0 ? { type: { $in: type } } : {}),
        ...(available ? { available } : {}),
        ...(paymentMethodType ? { paymentType: { $in: paymentMethodType?.split(',') } } : {}),
      }
      const paymentMethodAvailable = await this.paymentMethodModel.find(condition).sort({ type: 1 }).lean()
      return paymentMethodAvailable
    } catch (error) {
      this.logger.debug(error)
      throw Error('Error when find payment method')
    }
  }

  async getById(_id: string, projection = '') {
    try {
      if (!isValidObjectId(_id))
        return {
          _id: 'Payoo OL',
          name: 'Payoo OL',
          logoUrl: 'https://langfarm-backend.s3.ap-southeast-1.amazonaws.com/payment-method-QR.png',
          available: true,
          type: 4,
          payooType: 'bank-transfer',
          vatDisplayName: 'Chuyển khoản',
        }
      const paymentMethod = await this.paymentMethodModel.findById(_id).lean({
        transform: transformId,
      })
      return paymentMethod
    } catch (error) {
      this.logger.debug(error)
      return null
    }
  }

  async createPaymentMethod(payload: CreatePaymentMethodDto) {
    try {
      await validateOrReject(payload)
      const paymentMethod = await this.paymentMethodModel.create(payload)
      return paymentMethod
    } catch (error) {
      this.logger.debug(error)
      return null
    }
  }

  async updateOthersInfo(_id: string, payload: UpdatePaymentMethodDto) {
    try {
      await validateOrReject(payload)
      const updated = await this.paymentMethodModel.findOneAndUpdate({ _id }, payload, { new: true })
      return updated
    } catch (error) {
      this.logger.debug(error)
      throw Error('Error when update payment method')
    }
  }

  async removeBankAccount(paymentMethodId: string, bankAccountId: string) {
    return await this.paymentMethodModel.findByIdAndUpdate(paymentMethodId, {
      $pull: { bankAccounts: { _id: bankAccountId } },
    })
  }

  async addBankAccount(paymentMethodId: string, newBankAccount: BankAccount) {
    return await this.paymentMethodModel.findByIdAndUpdate(paymentMethodId, {
      $push: { bankAccounts: newBankAccount },
    })
  }

  async updateSingleBankAccount(paymentMethodId: string, bankAccountId: string, updateData: Partial<BankAccount>) {
    try {
      const update = {
        'bankAccounts.$.name': updateData.name,
        'bankAccounts.$.bankNumber': updateData.bankNumber,
        'bankAccounts.$.accountNumber': updateData.accountNumber,
        'bankAccounts.$.accountName': updateData.accountName,
        'bankAccounts.$.bankName': updateData.bankName,
        'bankAccounts.$.bankShortName': updateData.bankShortName,
        'bankAccounts.$.bankBranch': updateData.bankBranch,
        'bankAccounts.$.bankCode': updateData.bankCode,
        'bankAccounts.$.available': updateData.available,
        'bankAccounts.$.qrCode': updateData.qrCode,
        'bankAccounts.$.note': updateData.note,
      }
      for (const key in update) {
        if (update[key] === undefined || update[key] === null) {
          delete update[key]
        }
      }
      const updated = await this.paymentMethodModel.findOneAndUpdate(
        {
          _id: paymentMethodId,
          'bankAccounts._id': bankAccountId,
        },
        {
          $set: update,
        },
        { new: true },
      )

      return updated
    } catch (error) {
      this.logger.debug(error)
      throw new Error('Error updating bank account')
    }
  }
}
