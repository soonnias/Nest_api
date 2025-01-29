import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional, IsDateString, MinDate } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDiagnosisDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID пацієнта' })
  patientId: string;

  @IsDateString()
  @MinDate(new Date(), { message: 'Дата діагнозу не може бути в майбутньому' })
  @ApiProperty({ description: 'Дата діагнозу' })
  diagnosisDate: Date;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Назва діагнозу' })
  diagnosisName: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Опис діагнозу' })
  description?: string;
}