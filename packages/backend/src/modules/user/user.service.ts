import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { AuthCognitoService } from '@src/lib/auth-cognito/auth-cognito.service'
import { formatPhoneToE164 } from '@src/lib/helper/phone-number'
import { getSearchValue } from '@src/lib/helper/user'
import { Model, RootFilterQuery, Types } from 'mongoose'
import { RoleService } from '../role/role.service'
import { Role } from '../role/schemas/role.schema'
import { MailService } from '../shared/mail/mail.service'
import { provideAccount } from '../shared/mail/provide-account'
import { User, UserDocument } from './schemas/user.schema'
import { UserCognitoStatus, UserStatus } from './user.enum'

export interface IFindAllUsersOptions {
  size?: number
  page?: number
  search?: string
  status?: UserStatus[]
  roles?: string[]
  // sort?: string
  // sortOrder?: string
}

@Injectable()
export class UserService {
  @InjectModel(User.name) private readonly userModel: Model<UserDocument>

  @Inject() private readonly roleService: RoleService

  @Inject()
  private readonly authCognitoService: AuthCognitoService

  @Inject()
  private readonly mailService: MailService

  async findManyUsers(options: IFindAllUsersOptions) {
    const { page = 0, size = 25 } = options
    const roles = await this.roleService.findManyRoles({ search: '' })

    const filterUsers: RootFilterQuery<UserDocument> = {
      roleId: {
        $in: roles.map((e) => e?._id?.toString()),
      },
    }

    if (options.search) {
      filterUsers.searchValue = { $regex: options.search, $options: 'i' }
    }

    if (options.status) {
      filterUsers.status = { $in: options.status }
    }

    if (options.roles?.length) {
      filterUsers.roleId = { $in: options.roles }
    }

    const [users, count] = await Promise.all([
      this.userModel
        .find(filterUsers)
        .limit(size)
        .skip((page - 1) * size)
        .sort({ firstName: -1 })
        .select([
          '_id',
          'codeEmp',
          'createdAt',
          'firstName',
          'lastName',
          'updatedAt',
          'cognitoEnableStatus',
          'cognitoId',
          'cognitoStatus',
          'roleId',
          'status',
          'username',
          'searchValue',
          'email',
          'phoneNumber',
        ])
        .lean(),
      this.userModel.countDocuments(filterUsers),
    ])

    const rolesMap = new Map<string, Role>(roles.map((role) => [String(role._id), role]))

    return [
      users.map<User>((user) => {
        return {
          ...user,
          role: rolesMap.get(user.roleId?.toString() ?? ''),
        }
      }),
      count,
    ] as const
  }

  async getAllUsers() {
    const roles = await this.roleService.findManyRoles({ search: '' })

    const filterUsers: RootFilterQuery<UserDocument> = {
      roleId: {
        $in: roles.map((e) => e?._id?.toString()),
      },
    }

    const users = await this.userModel
      .find(filterUsers)
      .sort({ firstName: -1 })
      .select([
        '_id',
        'codeEmp',
        'createdAt',
        'firstName',
        'lastName',
        'updatedAt',
        'cognitoEnableStatus',
        'cognitoId',
        'cognitoStatus',
        'roleId',
        'status',
        'username',
        'searchValue',
        'email',
        'phoneNumber',
      ])
      .lean()

    const rolesMap = new Map<string, Role>(roles.map((role) => [String(role._id), role]))

    return users.map<User>((user) => {
      return {
        ...user,
        role: rolesMap.get(user.roleId?.toString() ?? ''),
      }
    })
  }

  async findUserByCognitoId(cognitoId: string) {
    return this.userModel.findOne({ cognitoId }).lean()
  }

  async findUserById(id: Types.ObjectId | string) {
    return this.userModel.findById(id).lean()
  }

  async findUserByUsername(username: string) {
    return this.userModel.findOne({ username }).lean()
  }

  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).lean()
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return this.userModel.findOne({ phoneNumber }).lean()
  }

  async mergeUser(data: Pick<UserDocument, 'email' | 'firstName' | 'lastName' | 'username' | 'roleId'>) {
    const existedUser = await this.userModel.findOneAndUpdate(
      { username: data.username },
      {
        email: data.email,
        phoneNumber: data.username,
        roleId: data.roleId ?? '',
        lastName: data.lastName,
        firstName: data.firstName,
      },
    )
    await this.authCognitoService.updateUserAttributes(data.username, [{ Name: 'custom:role', Value: data.roleId! }])
    return existedUser
  }

  async createUser(
    data: Pick<UserDocument, 'email' | 'firstName' | 'lastName' | 'username' | 'status' | 'roleId'> & {
      password: string
      searchValue?: string
    },
  ) {
    const existedPhoneUser = await this.userModel.findOne({ username: data.username })
    const existedEmailUser = await this.userModel.findOne({ email: data.email })

    if (existedPhoneUser) {
      throw new BadRequestException('Số điện thoại đã tồn tại')
    }
    if (existedEmailUser) {
      throw new BadRequestException('Email đã tồn tại')
    }

    const existedUser = await this.userModel.findOne({ username: data.username })
    if (existedUser) {
      return 'USER_EXISTED_IN_SYSTEM'
    }

    let confirmed = false

    // Generate user in Cognito
    const userCognito = await this.authCognitoService.registerUser({
      username: data.username,
      email: data.email,
      phoneNumber: data.username,
      password: data.password,
      role: data.roleId ?? '',
      lastName: data.lastName,
      firstName: data.firstName,
    })
    console.log('🚀 ~ UserService ~ userCognito:', userCognito)

    const content = this.mailService.setSimpleOption({
      from: 'center@langfarm.com',
      to: data.email,
      subject: '🎉 Chào mừng bạn đến với Langfarm Ticket - Thông tin tài khoản của bạn',
      html: provideAccount(data.username, data.password, `${process.env.FE_URL}`),
    })

    // Confirm account by admin
    try {
      await Promise.all([
        this.authCognitoService.confirmAccountByAdmin(data.username),
        this.authCognitoService.updateUserAttributes(data.username, [
          {
            Name: 'phone_number_verified',
            Value: 'true',
          },
          {
            Name: 'email_verified',
            Value: 'true',
          },
          {
            Name: 'preferred_username',
            Value: data.username,
          },
        ]),
        this.mailService.sendEmail(content),
      ])
      confirmed = true
    } catch (error) {
      console.log(error)
      confirmed = false
    }

    // Now, create user in database of our system
    return this.userModel.create({
      ...data,
      phoneNumber: data.username,
      cognitoId: userCognito.UserSub,
      cognitoStatus: confirmed ? UserCognitoStatus.Confirmed : UserCognitoStatus.Unconfirmed,
      cognitoEnableStatus: true,
      searchValue: getSearchValue(data, ['lastName', 'firstName', 'username', 'email', 'status']),
    })
  }

  async updateUser(id: Types.ObjectId, data: Partial<UserDocument>) {
    console.log('🚀 ~ UserService ~ updateUser ~ data:', data)
    const user = await this.userModel.findByIdAndUpdate(id, data)
    if (data?.status === UserStatus.Deactivated && user?.username) {
      await this.authCognitoService.disableUser(formatPhoneToE164(user?.username))
    }
    if (data?.status === UserStatus.Activated && user?.username) {
      await this.authCognitoService.enableUser(formatPhoneToE164(user?.username))
    }

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản')
    }

    return user
  }

  async deleteUser(id: Types.ObjectId) {
    const user = await this.userModel.findById(id)

    if (!user) {
      throw new NotFoundException('Không tìm thấy tài khoản')
    }
    await this.userModel.deleteOne({
      _id: id,
    })
    if (user?.username) {
      await this.authCognitoService.deleteUser(formatPhoneToE164(user?.username))
    }

    return user
  }
}
