import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Прізвище' })
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Ім\'я' })
  firstName: string;

  @IsNotEmpty()
  @ApiProperty({ description: 'Дата народження' })
  birthDate: Date;

  @IsPhoneNumber()
  @IsNotEmpty()
  @ApiProperty({ description: 'Номер телефону' })
  phoneNumber: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ description: 'Пошта (необов\'язково)' })
  email?: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Пароль' })
  password: string;

  @IsEnum(['user', 'admin'])
  @IsOptional()
  role?: 'user' | 'admin';
}
