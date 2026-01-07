import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class Verify2faDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty()
  @IsString()
  emailToken: string;

  @ApiProperty({ required: false, default: 'tp-nestjs-watchlist' })
  @IsOptional()
  source?: string = 'tp-nestjs-watchlist';
}
