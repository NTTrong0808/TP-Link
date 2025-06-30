/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-base-to-string */
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DEFAULT_PAGE_SIZE } from '@src/constants/pagination.constant'
import { Model, RootFilterQuery } from 'mongoose'
import { CurrentUserPayload } from '../auth/auth.decorator'
import { HistoryService } from '../shared/history/history.service'
import { CreateCustomerDto, UpdateCustomerDto } from './dto/customer.dto'
import { CustomerType, ILCCustomer, LCCustomer } from './schemas/customer.schema'
import { CustomerFilter, IEzCloudTA, IEzCloudTaSales } from './types'

@Injectable()
export class CustomerService {
  constructor(
    @InjectModel(LCCustomer.name) private customerModel: Model<ILCCustomer>,

    @Inject(forwardRef(() => HistoryService))
    private historyService: HistoryService,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<ILCCustomer> {
    const customer = new this.customerModel(createCustomerDto)
    return customer.save()
  }

  async findAll(filters?: RootFilterQuery<ILCCustomer>): Promise<ILCCustomer[]> {
    const _filters = filters ? { ...filters, isDeleted: false } : { isDeleted: false }
    return this.customerModel.find(_filters).lean().sort({ createdAt: -1 }).exec()
  }

  getCustomerFilter(options: CustomerFilter) {
    const filters = {}
    if (options.search) {
      filters['$or'] = [
        { name: { $regex: options.search, $options: 'i' } },
        { phone: { $regex: options.search, $options: 'i' } },
        { email: { $regex: options.search, $options: 'i' } },
      ]
    }

    if (options.isActive) {
      filters['isActive'] = {
        $in: options.isActive,
      }
    }
    if (options.type) {
      filters['type'] = {
        $in: options.type,
      }
    }
    filters['isDeleted'] = false
    return filters
  }

  async findManyCustomersPagination(options: {
    page: number
    size: number
    search?: string
    type?: CustomerType[]
    isActive?: boolean[]
  }) {
    const {
      page = 0,
      size = DEFAULT_PAGE_SIZE,
      //  isActive, type, search
    } = options
    const filters = this.getCustomerFilter(options)

    const [customers, count] = await Promise.all([
      this.customerModel
        .find(filters)
        .limit(size)
        .skip((page - 1) * size)
        .sort({ createdAt: -1 })
        .lean(),
      this.customerModel.countDocuments(filters),
    ])

    return [customers.map((e) => ({ ...e, _id: e?._id?.toString() })), count] as const
  }

  async findOne(id: string, selected = ''): Promise<ILCCustomer | null> {
    const customer = await this.customerModel
      .findOne(
        {
          _id: id,
          isDeleted: false,
        },
        selected,
      )
      .lean()
      .exec()
    if (!customer) throw new NotFoundException('Customer NotFound')
    return customer
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
    currentUser: CurrentUserPayload,
  ): Promise<ILCCustomer | null> {
    const oldData = await this.customerModel.findByIdAndUpdate(id, updateCustomerDto, { new: false }).lean()

    const newData = await this.customerModel.findById(id).lean()

    await this.historyService.create<ILCCustomer>('lccustomers', currentUser, newData?.updatedAt, newData, oldData)

    return newData
  }

  async delete(id: string): Promise<ILCCustomer | null> {
    return this.customerModel
      .findByIdAndUpdate(id, {
        isDeleted: true,
      })
      .lean()
      .exec()
  }

  async migrateTa(customers: IEzCloudTA[]) {
    const ops = customers.map((customer) => {
      const lcCustomer: Partial<ILCCustomer> = {
        name: customer.Name,
        phone: customer.CellPhone || customer.PhoneNumber || '',
        email: customer.Email || '',
        taxCode: customer?.IdentityCard, // Not available in IEzCloudTA
        companyEmail: customer.Email || '',
        companyName: customer.Name,
        address: customer.Address || '',
        type: CustomerType.TA,
        ezTotalSales: '0',
        ezProfileCode: customer.ProfileCode,
      }

      return {
        updateOne: {
          filter: { icNumber: customer.IdentityCard },
          update: { $set: lcCustomer },
          upsert: true,
        },
      }
    })

    if (ops.length > 0) {
      await this.customerModel.bulkWrite(ops)
    }

    return 'Oke'
  }

  async updateTotalSalesForTa(sales: IEzCloudTaSales[]) {
    const result = await Promise.all(
      sales.map((sale) =>
        this.customerModel.updateOne(
          {
            ezProfileCode: sale['Mã đại lý'],
          },
          {
            ezTotalSales: sale['Tổng tiền (VND)'],
          },
        ),
      ),
    )
    return result
  }

  async getCustomerHistory(id: string) {
    return this.historyService.findAll('lccustomers', id)
  }
}
