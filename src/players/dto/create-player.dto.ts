import { IsString, IsDate, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlayerDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsNumber()
  jerseyNumber?: number;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsNumber()
  height?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}