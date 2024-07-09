import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator'

export class UserSocialNetworkCreateDto {
  @IsString()
  @IsOptional()
  profileUrl?: string

  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  socialNetworkId?: string

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

export class UserSocialNetworkUpdateDto {
  @IsString()
  @IsOptional()
  profileUrl?: string

  @IsString()
  @IsOptional()
  userId?: string

  @IsString()
  @IsOptional()
  socialNetworkId?: string

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
