import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateWatchedMovieDto {
  @ApiProperty({ example: 'Inception' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Christopher Nolan', required: false })
  @IsOptional()
  @IsString()
  director?: string;

  @ApiProperty({ example: 2010, required: false })
  @IsOptional()
  @IsNumber()
  year?: number;

  @ApiProperty({ example: 'Super film', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ required: false, default: 'tp-nestjs-watchlist' })
  @IsOptional()
  source?: string = 'tp-nestjs-watchlist';
}
