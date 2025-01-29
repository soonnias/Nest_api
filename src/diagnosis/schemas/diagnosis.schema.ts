import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Patient } from 'src/patients/schemas/patient.schema';

@Schema()
export class Diagnosis extends Document {
  @Prop({ type: Types.ObjectId, ref: Patient.name, required: true })
  patientId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  diagnosisDate: Date;

  @Prop({ type: String, required: true })
  diagnosisName: string;

  @Prop({ type: String, required: false })
  description?: string;
}

export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
