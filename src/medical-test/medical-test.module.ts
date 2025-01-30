import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MedicalTestController } from './medical-test.controller';
import { MedicalTestService } from './medical-test.service';
import { MedicalTestSchema } from './schemas/medical-test.schema';
import { PatientModule } from 'src/patients/patient.module';
import { TestTypesModule } from 'src/test-types/test-types.module';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'MedicalTest', schema: MedicalTestSchema }]),PatientModule, TestTypesModule],
  controllers: [MedicalTestController],
  providers: [MedicalTestService],
})
export class MedicalTestModule {}
