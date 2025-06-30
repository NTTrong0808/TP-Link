import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class SignupDto {
  @IsPhoneNumber()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @IsStrongPassword()
  password: string;
}
