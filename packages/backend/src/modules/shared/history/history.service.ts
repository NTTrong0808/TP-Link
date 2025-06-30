/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { COLLECTION_NAME } from '@src/constants/collection-name.constant'
import { appDayJs } from '@src/lib/dayjs'
import { diff, Diff } from 'deep-diff'
import { Model, RootFilterQuery, Types } from 'mongoose'
import { CurrentUserPayload } from '../../auth/auth.decorator'
import { ActionType, LCHistory } from './schemas/history.schema'

@Injectable()
export class HistoryService {
  constructor(
    @InjectModel(LCHistory.name)
    private historyModel: Model<LCHistory>,
  ) {}

  private getObjectDifferences(
    oldObj: Record<string, unknown> | null,
    newObj: Record<string, unknown> | null,
  ): Record<string, [unknown, unknown]> {
    const differences = (diff(oldObj, newObj) as Diff<Record<string, unknown>>[]) || []
    const changes: Record<string, [unknown, unknown]> = {}

    differences?.forEach((change) => {
      if (!change.path) return

      const key = change.path.join('.')

      switch (change.kind) {
        case 'E': // Edited
          if ('lhs' in change && 'rhs' in change) {
            changes[key] = [change.lhs, change.rhs]
          }
          break

        case 'N': // New
          if ('rhs' in change) {
            changes[key] = [null, change.rhs]
          }
          break

        case 'D': // Deleted
          if ('lhs' in change) {
            changes[key] = [change.lhs, null]
          }
          break

        case 'A': // Array
          if ('index' in change && 'item' in change) {
            const arrayPath = [...change.path]
            arrayPath[arrayPath.length - 1] = `${arrayPath[arrayPath.length - 1]}[${change.index}]`
            const arrayKey = arrayPath.join('.')

            const arrayChange = change.item

            if (arrayChange.kind === 'E' && 'lhs' in arrayChange && 'rhs' in arrayChange) {
              changes[arrayKey] = [arrayChange.lhs, arrayChange.rhs]
            } else if (arrayChange.kind === 'N' && 'rhs' in arrayChange) {
              changes[arrayKey] = [undefined, arrayChange.rhs]
            } else if (arrayChange.kind === 'D' && 'lhs' in arrayChange) {
              changes[arrayKey] = [arrayChange.lhs, undefined]
            }
          }
          break
      }
    })

    return changes
  }

  /**
   * Tạo một bản ghi lịch sử cho các thay đổi trong collection
   * @param collectionName - Tên collection được thay đổi
   * @param user - Thông tin người dùng thực hiện thay đổi
   * @param time - Thời gian thực hiện thay đổi, mặc định là thời gian hiện tại
   * @param newData - Dữ liệu mới sau khi thay đổi
   * @param oldData - Dữ liệu cũ trước khi thay đổi
   * @returns Promise<void>
   */
  async create<T extends { _id: Types.ObjectId | string }>(
    collectionName: (typeof COLLECTION_NAME)[keyof typeof COLLECTION_NAME],
    user: CurrentUserPayload,
    time: Date | string = appDayJs().toDate(),
    newData: Partial<T> | null = {},
    oldData: Partial<T> | null = {},
  ): Promise<void> {
    const changes = this.getObjectDifferences(oldData, newData)

    let actionType = ActionType.CREATE
    if (oldData && Object.keys(oldData).length > 0) {
      actionType = ActionType.UPDATE
    }
    if (newData && Object.keys(newData).length === 0) {
      actionType = ActionType.DELETE
    }

    const data = {
      changeId: newData?._id || oldData?._id,
      collectionName,
      actionType,
      oldData,
      newData,
      changes,
      changeBy: user._id,
      changeAt: time,
    }

    await this.historyModel.create(data)
  }

  async findAll(
    collectionName: (typeof COLLECTION_NAME)[keyof typeof COLLECTION_NAME],
    targetId: string | Types.ObjectId,
    user?: CurrentUserPayload,
  ): Promise<LCHistory[]> {
    const filter: RootFilterQuery<LCHistory> = { collectionName, changeId: targetId }
    if (user) {
      filter.changeBy = user._id
    }
    return await this.historyModel.aggregate([
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          let: { changeBy: { $toObjectId: '$changeBy' } },
          pipeline: [
            { $match: { $expr: { $eq: ['$$changeBy', '$_id'] } } },
            { $project: { _id: 1, firstName: 1, lastName: 1 } },
          ],
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          changeByName: {
            $concat: ['$user.lastName', ' ', '$user.firstName'],
          },
        },
      },
      { $sort: { changeAt: -1 } },
    ])
  }

  async findOne(id: string): Promise<LCHistory> {
    const history = await this.historyModel.findById(id)
    if (!history) {
      throw new NotFoundException(`History not found`)
    }
    return history
  }
}
