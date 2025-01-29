import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { Patient, PatientSchema } from './schemas/patient.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Patient.name, schema: PatientSchema }])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
