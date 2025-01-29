import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient, PatientDocument } from './schemas/patient.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class PatientService {
  constructor(@InjectModel(Patient.name) private patientModel: Model<PatientDocument>) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const { phoneNumber, email, password } = createPatientDto;

    // Перевірка унікальності телефону та пошти
    const existingPatient = await this.patientModel.findOne({
        $or: [{ phoneNumber }, { email }],
    });

    if (existingPatient) {
        throw new ConflictException('Phone number or email already exists');
    }

    // Хешування пароля перед збереженням
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const patient = new this.patientModel({
        ...createPatientDto,
        password: hashedPassword, // Зберігаємо хешований пароль
    });

    return patient.save();
}

  async getAllPatients(): Promise<Patient[]> {
    return this.patientModel.find().exec();
  }

  async getPatientById(id: string): Promise<Patient> {
    const patient = await this.patientModel.findById(id).exec();
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return patient;
  }

  async deletePatient(id: string): Promise<{ message: string }> {
    const deleted = await this.patientModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }
    return { message: 'Patient deleted successfully' };
  }
}
