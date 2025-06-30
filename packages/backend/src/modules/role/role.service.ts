import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AnyBulkWriteOperation, Model, ObjectId } from 'mongoose'
import { CreateRoleDto } from './dtos/create-role.dto'
import { UpdateRoleDto } from './dtos/update-role.dto'
import { RolePermissionsMap } from './role.constant'
import { RoleCode, RoleName, RoleProvider } from './role.enum'
import { Role, RoleDocument } from './schemas/role.schema'

export interface IFindManyRolesOptions {
  search?: string
}

@Injectable()
export class RoleService {
  @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>
  async findManyRoles(options: IFindManyRolesOptions) {
    const { search = '' } = options

    const roles = await this.roleModel
      .find({
        name: { $regex: search, $options: 'i' },
        isDeleted: false,
        $or: [{ permissionKeys: 'manage:all' }, { permissionKeys: { $regex: 'ticket', $options: 'i' } }],
      })
      .exec()

    return roles
  }

  async findRoleById(id: string | ObjectId) {
    return this.roleModel.findById(id).exec()
  }

  async createRole(data: CreateRoleDto) {
    const role = await this.roleModel.create({
      ...data,
    })
    return role
  }

  async updateRole(id: string | ObjectId, data: UpdateRoleDto) {
    const updated = await this.roleModel.updateOne({ id }, { $set: data }).exec()
    return updated.modifiedCount > 0
  }

  async deleteRole(id: string | ObjectId) {
    const r = await this.roleModel.deleteOne({ _id: id }).exec()

    return r.deletedCount > 0
  }

  async deleteManyRoles(ids: string[] | ObjectId[]) {
    const r = await this.roleModel.deleteMany({ _id: { $in: ids } }).exec()
    return r.deletedCount > 0
  }

  getRolePermissions() {
    return Object.values(RoleCode)
  }

  async allocation() {
    // NOTE: Only run this function once if you do not have any role in database
    const bulkOps: AnyBulkWriteOperation[] = Object.values(RoleCode).map((roleCode) => ({
      updateOne: {
        filter: { roleCode: roleCode, provider: RoleProvider.Ticket },
        update: {
          $set: {
            provider: RoleProvider.Ticket,
            description: '',
            permissionKeys: RolePermissionsMap[roleCode],
            isActive: true,
            roleCode: roleCode,
            name: RoleName[roleCode],
          },
        },
        upsert: true,
        timestamps: true,
      },
    }))

    await this.roleModel.bulkWrite(bulkOps)
    return
  }
}
