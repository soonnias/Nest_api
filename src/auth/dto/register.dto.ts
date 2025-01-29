// register.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
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
  @IsNotEmpty()
  @ApiProperty({ description: 'Пошта' })
  email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ description: 'Пароль' })
  password: string;

  @IsEnum(['user', 'admin'])
  @IsOptional()
  role: 'user' | 'admin';
}
