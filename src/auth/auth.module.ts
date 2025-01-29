import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { Patient, PatientSchema } from '../patients/schemas/patient.schema';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }]),
    ConfigModule.forRoot(),  // Завантажуємо змінні середовища
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],  // Якщо ви хочете створити контролер для auth
})
export class AuthModule {}
