import { COLLECTION_NAME } from '@src/constants/collection-name.constant';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { IsObjectId } from 'nestjs-object-id';
import { ActionType } from '../schemas/history.schema';

export class CreateCustomerHistoryDto {
  @IsNotEmpty()
  @IsEnum(COLLECTION_NAME)
  collectionName: (typeof COLLECTION_NAME)[keyof typeof COLLECTION_NAME]

  @IsNotEmpty()
  @IsEnum(ActionType)
  actionType: string

  @IsOptional()
  @IsString()
  actionDescription?: string

  @IsOptional()
  @IsObject()
  oldData: Record<string, any>

  @IsOptional()
  @IsObject()
  newData: Record<string, any>

  @IsOptional()
  @IsObject()
  changes?: Record<string, [unknown, unknown]>

  @IsOptional()
  @IsString()
  changeId?: string

  @IsOptional()
  @IsObjectId()
  changeBy?: Types.ObjectId

  @IsOptional()
  @IsString()
  changeAt?: string
}
