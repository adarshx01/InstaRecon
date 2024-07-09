import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class ProfileCreateDto {
  @IsString()
  @IsOptional()
  publicUrl?: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsString()
  @IsOptional()
  avatarUrl?: string

  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  dateCreated?: string

  @IsString()
  @IsOptional()
  dateDeleted?: string

  @IsString()
  @IsOptional()
  dateUpdated?: string
}

export class ProfileUpdateDto {
  @IsString()
  @IsOptional()
  publicUrl?: string

  @IsString()
  @IsOptional()
  bio?: string

  @IsString()
  @IsOptional()
  avatarUrl?: string

  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  dateCreated?: string

  @IsString()
  @IsOptional()
  dateDeleted?: string

  @IsString()
  @IsOptional()
  dateUpdated?: string
}
