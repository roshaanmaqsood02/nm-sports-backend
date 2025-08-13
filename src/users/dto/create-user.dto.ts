import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  IsArray,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  roles?: string[]; // default will be handled in entity

  @IsNotEmpty()
  @IsString()
  tenantId: string; // required because of entity relationship

  @IsNotEmpty()
  @IsString()
  tenantName?: string;

  @IsNotEmpty()
  @IsString()
  slug?: string;
}
