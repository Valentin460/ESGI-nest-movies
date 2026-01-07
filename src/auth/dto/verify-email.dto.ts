import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'abc123def456' })
  @IsNotEmpty()
  @IsString()
  emailToken: string;

  @ApiProperty({ required: false, default: 'tp-nestjs-watchlist' })
  @IsOptional()
  source?: string = 'tp-nestjs-watchlist';
}
