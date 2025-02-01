import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Diagnosis } from './schemas/diagnosis.schema';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { PatientService } from 'src/patients/patient.service';

@Injectable()
export class DiagnosisService {
  constructor(@InjectModel(Diagnosis.name) private diagnosisModel: Model<Diagnosis>, private readonly patientService: PatientService,) {}

  async create(createDiagnosisDto: CreateDiagnosisDto): Promise<Diagnosis> {
    const patientIdObjectId = new Types.ObjectId(createDiagnosisDto.patientId);

    const patientExists = await this.patientService.getPatientById(createDiagnosisDto.patientId);
    if (!patientExists) {
      throw new NotFoundException('Пацієнт не знайдений');
    }

    const diagnosis = new this.diagnosisModel({
      ...createDiagnosisDto,
      patientId: patientIdObjectId,
    });

    return await diagnosis.save();
  }


  async findByPatientId(patientId: Types.ObjectId): Promise<Diagnosis[]> {
    return this.diagnosisModel.find({ patientId }).populate('patientId').exec();
  }

  async findById(id: string): Promise<Diagnosis> {
    const objectId = new Types.ObjectId(id);
    const diagnosis = await this.diagnosisModel.findById(objectId).populate('patientId').exec();
    if (!diagnosis) {
      throw new NotFoundException(`Diagnosis with id ${id} not found`);
    }
    return diagnosis;
  }
  
      async getAllDiagnosis(): Promise<Diagnosis[]> {
        return this.diagnosisModel.find().populate('patientId').exec();
    }

  
    async updateDescription(diagnosisId: string, description: string): Promise<Diagnosis> {
        const diagnosis = await this.diagnosisModel.findById(diagnosisId);
        if (!diagnosis) {
          throw new NotFoundException(`Diagnosis with ID ${diagnosisId} not found`);
        }
      
        diagnosis.description = description;
        
        return diagnosis.save();
      }
}