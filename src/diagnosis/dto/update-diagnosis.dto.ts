import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateDiagnosisDto {
  @IsString()
  @ApiProperty({ description: 'Опис діагнозу' })
  description: string;
}