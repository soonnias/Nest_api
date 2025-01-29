import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Patient } from 'src/patients/schemas/patient.schema';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<Patient>, private configService: ConfigService, ) {}

  async register(registerDto: RegisterDto): Promise<{ patient: Patient; token: string }> {
    const { phoneNumber, email, password } = registerDto;

    // Перевірка унікальності телефону та пошти
    const existingPatient = await this.patientModel.findOne({
      $or: [{ phoneNumber }, { email }],
    });

    if (existingPatient) {
      throw new ConflictException('Phone number or email already exists');
    }

    // Хешування пароля
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newPatient = new this.patientModel({
      ...registerDto,
      password: hashedPassword,
    });

    await newPatient.save();

    // Створення JWT токену
    const token = this.createJwtToken(newPatient);

    return { patient: newPatient, token };
  }

  private createJwtToken(patient: Patient): string {
    const payload = { id: patient.phoneNumber, role: patient.role };
    const jwtSecret = this.configService.get<string>('JWT_SECRET');

    // Перевірка, чи є значення для JWT_SECRET
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }

    console.log()

    return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
  }



  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const { phoneNumber, password } = loginDto;

    const patient = await this.patientModel.findOne({ phoneNumber });

    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }

    console.log(patient)

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Створення JWT токену
    const token = this.createJwtToken(patient);
    return { token };
  }
}