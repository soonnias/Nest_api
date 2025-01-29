import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Diagnosis, DiagnosisSchema } from './schemas/diagnosis.schema';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { PatientService } from 'src/patients/patient.service';
import { PatientModule } from 'src/patients/patient.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: Diagnosis.name, schema: DiagnosisSchema }]), PatientModule],
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
})
export class DiagnosisModule {}
