import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDateString, IsOptional } from 'class-validator';
import { Express } from 'express';

export class CreateMedicalTestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID користувача' })
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'ID типу тесту' })
  testTypeId: string;

  @IsDateString()
  @ApiProperty({ description: 'Дата виконання тесту' })
  testDate: Date;
}

export class UpdateMedicalTestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Результат тесту' })
  result?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Рекомендації' })
  recommendations?: string;

  @IsOptional()
  //@ApiProperty({ description: 'Шлях до збереженого файлу' })
  filePath?: string;

}
